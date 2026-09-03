// 发布版在 Windows 上不显示额外的命令行窗口
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    wechat_dialogue_generator_lib::run();
}
