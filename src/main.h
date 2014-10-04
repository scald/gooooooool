#include <pebble.h>
Window *main_window;
ActionBarLayer *main_ab;
TextLayer *info_layer;
InverterLayer *main_theme;
bool left_invert = false;

#define FORWARD 0
#define FORWARD_D 1
#define RIGHT 2
#define RIGHT_D 3
#define DOWN 4
#define DOWN_D 5
#define LEFT 6
#define LEFT_D 7