<?php
// 1. 核心安全锁：防止黑客直接通过网址访问这个 PHP 文件
defined('ABSPATH') or exit;

// 2. 注册 WP REST API 路由
// 接口对外地址将变成: 你的域名/wp-json/poilive2d/v1/model
add_action('rest_api_init', function () {
    register_rest_route('poilive2d/v1', '/model', array(
        'methods' => 'GET',
        'callback' => 'poilive2d_rest_api_model_handler',
        'permission_callback' => '__return_true' // 允许所有访客（非登录用户）读取
    ));
});

// 3. 核心处理逻辑
function poilive2d_rest_api_model_handler($request) {
    // 获取 GET 参数
    $model_name = $request->get_param('model');
    $model_name = $model_name ? basename($model_name) : '天依';
    $tex_id = intval($request->get_param('tex'));

    // 定位到对应的模型文件夹
    $model_dir = LIVE2D_PATH . '/live2d/model/' . $model_name;
    
    // 匹配任意以 model.json 结尾的文件
    $v2_models = glob($model_dir . '/*model.json');

    if (empty($v2_models)) {
        return new WP_Error('not_found', '找不到模型配置文件: ' . $model_name, array('status' => 404));
    }

    $base_json_path = $v2_models[0];
    $json_content = file_get_contents($base_json_path);
    $model_data = json_decode($json_content, true);

    // 扫描 textures 文件夹找衣服
    $textures = glob($model_dir . '/textures/*.png');
    $valid_tex_ids = array();
    if ($textures) {
        foreach ($textures as $tex) {
            $filename = basename($tex, '.png');
            if (is_numeric($filename)) {
                $valid_tex_ids[] = intval($filename);
            }
        }
    }

    // 对模型名称进行标准的 URL 编码（防止中文路径乱码）
    $safe_model_url = rawurlencode($model_name);

    // ★ 生成带域名的绝对路径基础 URL
    $base_model_url = LIVE2D_URL . '/live2d/model/' . $safe_model_url . '/';

    // 动态换装逻辑：覆盖原本的 textures 数组
    if (!empty($valid_tex_ids)) {
        if ($tex_id > 0 && in_array($tex_id, $valid_tex_ids)) {
            $selected_tex = $tex_id;
        } else {
            // 默认随机选一件
            $selected_tex = $valid_tex_ids[array_rand($valid_tex_ids)];
        }
        // 强制拼装为绝对路径
        $model_data['textures'] = array(
            $base_model_url . 'textures/' . $selected_tex . '.png'
        );
    }

    // 修复模型骨架 (model.moc) 的绝对路径
    if (isset($model_data['model'])) {
        $model_data['model'] = $base_model_url . ltrim($model_data['model'], '/');
    }
    
    // 修复动作文件 (.mtn) 和 音频文件 (.mp3) 的绝对路径
    if (isset($model_data['motions'])) {
        foreach ($model_data['motions'] as $key => $motions) {
            foreach ($motions as $index => $motion) {
                if (isset($motion['file'])) {
                    $model_data['motions'][$key][$index]['file'] = $base_model_url . ltrim($motion['file'], '/');
                }
                if (isset($motion['sound'])) {
                    $model_data['motions'][$key][$index]['sound'] = $base_model_url . ltrim($motion['sound'], '/');
                }
            }
        }
    }

    // 4. 返回标准 JSON 响应，WordPress 会自动处理头信息并输出
    return rest_ensure_response($model_data);
}