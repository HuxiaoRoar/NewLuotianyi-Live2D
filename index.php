<?php
/*
Plugin Name:新·洛天依 Live2D插件
Plugin URI: https://www.luotianyi.blue/newluotianyi-live2d
Description: 百变天依的四重奏！全新WordPress插件，支持自由切换新旧模型、后台自定义样式、交互和一言设置。
Version: 1.0
Author: 虎啸ROAR
Author URI: https://www.luotianyi.blue
License: GPLV2
*/

defined('ABSPATH') or exit;
define('LIVE2D_VERSION', '1.7.12');
define('LIVE2D_URL', plugins_url('', __FILE__));
define('LIVE2D_PATH', dirname(__FILE__));

if (file_exists(LIVE2D_PATH . '/option/settings-api.php')) {
    require_once LIVE2D_PATH . '/option/settings-api.php';
}



function poilive2d_register_plugin_settings_link($links)
{
    $settings_link = '<a href="options-general.php?page=nlty-live2d">设置</a>';
    array_unshift($links, $settings_link);
    return $links;
}
$plugin = plugin_basename(__FILE__);
add_filter("plugin_action_links_{$plugin}", 'poilive2d_register_plugin_settings_link');

if (is_admin()) {
    add_action('admin_menu', 'poilive2d_menu');
}

function poilive2d_menu()
{
    add_options_page('新·洛天依Live2D控制面板', '新·洛天依Live2D', 'manage_options', 'nlty-live2d', 'poilive2d_pluginoptions_page');
}

function poilive2d_pluginoptions_page()
{
    require "option.php";
}



// 将脚本排队加载到后台页面
add_action('admin_enqueue_scripts', 'poilive2d_admin_scripts');

function poilive2d_admin_scripts($hook_suffix)
{
	// 确保只在插件设置页面加载。
	if ($hook_suffix !== 'settings_page_nlty-live2d') {
		return;
	}

	// 开发调试时加载原始 JS，正常环境加载压缩后的 .min.js。
	$script_suffix = (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG) ? '' : '.min';

	wp_enqueue_style(
		'poilive2d-admin-css',
		plugin_dir_url(__FILE__) . 'option/admin-style.css',
		array(),
		'1.0'
	);

	// 1. 加载 WordPress 核心 CodeMirror 资源。
	$settings = wp_enqueue_code_editor(
		array(
			'type' => 'application/json',
		)
	);

	// 2. 加载颜色选择器等基础库。
	wp_enqueue_style('wp-color-picker');
	wp_enqueue_script('wp-color-picker');

	wp_enqueue_script(
		'wp-color-picker-alpha',
		plugins_url('option/wp-color-picker-alpha.min.js', __FILE__),
		array('wp-color-picker'),
		'3.0.0',
		true
	);

	// 3. 加载本插件后台脚本。
	wp_enqueue_script(
		'poilive2d-admin-js',
		plugins_url(
			'option/admin-scripts' . $script_suffix . '.js',
			__FILE__
		),
		array('jquery', 'wp-color-picker-alpha'),
		LIVE2D_VERSION,
		true
	);

	$default_file = LIVE2D_PATH . '/option/defaults.json';

	$defaults_data = file_exists($default_file)
		? json_decode(file_get_contents($default_file), true)
		: array();

	// 4. 注入编辑器配置和默认数据。
	wp_add_inline_script(
		'poilive2d-admin-js',
		'var poilive2d_editor_settings = ' . wp_json_encode($settings) . ';' .
		'var poilive2d_defaults = ' . wp_json_encode($defaults_data) . ';',
		'after'
	);
}

require_once LIVE2D_PATH . '/live2d/live2d-v2api.php';
require LIVE2D_PATH . '/main.php';
?>