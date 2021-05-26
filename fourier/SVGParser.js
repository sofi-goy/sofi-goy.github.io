function generatePointsFromSvg(current_svg_xml) {
    var step_point = 2;

    var parser = new DOMParser();
    var doc = parser.parseFromString(current_svg_xml, "application/xml");
    var paths = doc.getElementsByTagName("path");
    // console.log(paths);

    // Read each paths from svg
    all_points = [];
    var all_points_count = 0;
    for (var i = 0; i < paths.length; ++i) {
        var path = paths[i].getAttribute('d').replace(' ', ',');

        // get points at regular intervals
        for (var c = 0; c < Raphael.getTotalLength(path); c += step_point) {
            var point = Raphael.getPointAtLength(path, c);

            all_points.push([point.x, point.y]);
        }
    }

    return all_points;
}