function update_percentage(to_update_element_name, tracked_element_name) {
    var to_update_element = document.getElementById(to_update_element_name);
    var tracked_element = document.getElementById(tracked_element_name);

    var width = tracked_element.style.width;

    to_update_element.innerHTML = width * 1 + "%";
}