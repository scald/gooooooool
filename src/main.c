#include <pebble.h>
#include "main.h"
	
void send_pulse(uint8_t toSend){
	DictionaryIterator *iter;
	app_message_outbox_begin(&iter);

	dict_write_uint8(iter, 99, toSend);

	app_message_outbox_send();
}
	
void up_init(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Up init");
	send_pulse(FORWARD);
}

void up_deinit(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Up deinit");
	send_pulse(FORWARD_D);
}

void down_init(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Down init");
	send_pulse(DOWN);
}

void down_deinit(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Down deinit");
	send_pulse(DOWN_D);
}

void right_init(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Right init");
	send_pulse(RIGHT);
}

void right_deinit(ClickRecognizerRef recognizer, void *context){
	text_layer_set_text(info_layer, "Right deinit");
	send_pulse(RIGHT_D);
}

void left(ClickRecognizerRef recognizer, void *context){
	left_invert = !left_invert;
	if(left_invert){
		text_layer_set_text(info_layer, "Left init");
		send_pulse(LEFT);
	}
	else{
		text_layer_set_text(info_layer, "Left deinit");
		send_pulse(LEFT_D);
	}
}

void got_data(DictionaryIterator *iter, void *context){
	Tuple *t = dict_read_first(iter);
	switch(t->key){
		case 10:
			if(t->value->int32 == 1){
				text_layer_set_text(status_layer, "Success");
			}
			else{
				text_layer_set_text(status_layer, "Fail");
			}
			break;
	}
}
	
void click_config(ClickRecognizerRef click){
	window_long_click_subscribe(BUTTON_ID_UP, 10, up_init, up_deinit);
	window_long_click_subscribe(BUTTON_ID_DOWN, 10, down_init, down_deinit);
	window_long_click_subscribe(BUTTON_ID_SELECT, 10, right_init, right_deinit);
	window_single_click_subscribe(BUTTON_ID_BACK, left);
}
	
void window_load_main(Window *w){
	main_ab = action_bar_layer_create();
	action_bar_layer_set_click_config_provider(main_ab, click_config);
	action_bar_layer_add_to_window(main_ab, main_window);
	action_bar_layer_set_icon(main_ab, BUTTON_ID_UP, gbitmap_create_with_resource(RESOURCE_ID_IMAGE_ARROW_UP));
	action_bar_layer_set_icon(main_ab, BUTTON_ID_DOWN, gbitmap_create_with_resource(RESOURCE_ID_IMAGE_ARROW_DOWN));
	action_bar_layer_set_icon(main_ab, BUTTON_ID_SELECT, gbitmap_create_with_resource(RESOURCE_ID_IMAGE_ARROW_NEXT));
	
	info_layer = text_layer_create(GRect(2, 0, 120, 168));
	text_layer_set_text_alignment(info_layer, GTextAlignmentLeft);
	text_layer_set_background_color(info_layer, GColorClear);
	text_layer_set_font(info_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28));
	layer_add_child(window_get_root_layer(w), text_layer_get_layer(info_layer));
	
	status_layer = text_layer_create(GRect(2, 50, 120, 168));
	text_layer_set_text_alignment(status_layer, GTextAlignmentLeft);
	text_layer_set_background_color(status_layer, GColorClear);
	text_layer_set_font(status_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28_BOLD));
	layer_add_child(window_get_root_layer(w), text_layer_get_layer(status_layer));
	
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
	
	app_message_register_inbox_received(got_data);
	app_message_open(512, 512);
}

void deinit(){
	window_destroy(main_window);
}
	
int main(){
	init();
	app_event_loop();
	deinit();
}