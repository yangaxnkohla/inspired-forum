export function auto_grow(element) {
    element.css("height", "5px");
    element.style.height = (element.scrollHeight)+"px";
}