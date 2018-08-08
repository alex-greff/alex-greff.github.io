const EDUCATION_CANVAS_NAME = "education-page-canvas";
const EDUCATION_CONTAINER_NAME = "education-page-container";
const EDUCATION_CONTAINER_DECORATOR_TOP_1 = "education-page-decorator-top-1";
const EDUCATION_CONTAINER_DECORATOR_TOP_2 = "education-page-decorator-top-2";
const EDUCATION_CONTAINER_DECORATOR_BOTTOM_1 = "education-page-decorator-bottom-1";

function initialize_education_page() {
	update_education_page();
}

function onResizeEvent_education_page() {
	update_education_page();
}

function update_education_page() {
	// update_canvas_dimensions(EDUCATION_CANVAS_NAME, 0, 0);
	// update_canvas_background_color(EDUCATION_CANVAS_NAME, "#282828");

	set_container_offset(EDUCATION_CONTAINER_NAME, 1, 40);
	set_container_height(EDUCATION_CONTAINER_NAME, 1, 0);

	set_container_offset(EDUCATION_CONTAINER_DECORATOR_TOP_1, 1, -40+40); // Note: last value relies on css height value
	set_container_offset(EDUCATION_CONTAINER_DECORATOR_TOP_2, 1, -40+40); // Note: last value relies on css height value
	set_container_offset(EDUCATION_CONTAINER_DECORATOR_BOTTOM_1, 2, 40);
}

