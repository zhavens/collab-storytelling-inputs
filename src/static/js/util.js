export function getUrl(...components) {
    var root = window.location.origin + "/" + window.location.pathname.split("/")[1];
    components = components.map(x => encodeURIComponent(x));
    var suffix = components.join("/");
    return root + "/" + suffix;
}