const PROJECTS_CONTAINER_NAME = "projects-page-container";
const PROJECTS_CONTAINER_DECORATOR_TOP_1 = "projects-page-decorator-top-1";
const PROJECTS_CONTAINER_DECORATOR_TOP_2 = "projects-page-decorator-top-2";

function initialize_projects_page() {
	update_projects_page();
}

function onResizeEvent_projects_page() {
	update_projects_page();	
}

function update_projects_page() {
	set_container_offset(PROJECTS_CONTAINER_NAME, 2, 80);
	set_container_height(PROJECTS_CONTAINER_NAME, 1, 0);

	set_container_offset(PROJECTS_CONTAINER_DECORATOR_TOP_1, 2, 40); // Note: last value relies on css height value
	set_container_offset(PROJECTS_CONTAINER_DECORATOR_TOP_2, 2, 40); // Note: last value relies on css height value
}