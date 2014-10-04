#include <pebble.h>
#include "main.h"
	
void up(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Up");
}

void down(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Down");
}

void right(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Right");
}

void left(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Left");
}
	
void click_config(ClickRecognizerRef click){
	window_single_repeating_click_subscribe(BUTTON_ID_UP, 50, up);
	window_single_repeating_click_subscribe(BUTTON_ID_DOWN, 50, down);
	window_single_repeating_click_subscribe(BUTTON_ID_SELECT, 50, right);
	window_single_click_subscribe(BUTTON_ID_BACK, left);
}
	
void window_load_main(Window *w){
	main_ab = action_bar_layer_create();
	action_bar_layer_set_click_config_provider(main_ab, click_config);
	action_bar_layer_add_to_window(main_ab, main_window);
	action_bar_layer_set_icon(main_ab, BUTTON_ID_UP, gbitmap_create_with_resource(RESOURCE_ID_IMAGE_ARROW_UP));
	action_bar_layer_set_icon(main_ab, BUTTON_ID_DOWN, gbitmap_create_with_resource(RESOURCE_ID_IMAGE_ARROW_DOWN));
	action_bar_layer_set_icon(main_ab, BUTTON_ID_SELECT, gbitmap_create_with_resource(RESOURCE_ID_IMAGE_ARROW_NEXT));
	
	info_layer = text_layer_create(GRect(0, 0, 120, 168));
	text_layer_set_text_alignment(info_layer, GTextAlignmentLeft);
	text_layer_set_background_color(info_layer, GColorClear);
	text_layer_set_font(info_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28));
	layer_add_child(window_get_root_layer(w), text_layer_get_layer(info_layer));
	
	main_theme = inverter_layer_create(GRect(0, 0, 144, 168));
	layer_add_child(window_get_root_layer(main_window), inverter_layer_get_layer(main_theme));
}

void window_unload_main(Window *w){
	action_bar_layer_destroy(main_ab);
}
	
void init(){
	main_window = window_create();
	window_set_fullscreen(main_window, true);
	window_set_window_handlers(main_window, (WindowHandlers){
		.load = window_load_main,
		.unload = window_unload_main,
	});
	window_stack_push(main_window, true);
}

void deinit(){
	window_destroy(main_window);
}
	
int main(){
	init();
	app_event_loop();
	deinit();
}