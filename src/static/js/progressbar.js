/* ---------------
 *  PROGRESS BAR
 * ---------------*/
import { log } from "./logging.js";
var loadingView = document.getElementById("loading-view");
var drawingView = document.getElementById("drawing-view");
var title = document.getElementById("title");
var start;
var end;

const WAIT_TIME_SECS = 35;

export function setUpProgressBar() {
    loadingView.style.display = "block";
    drawingView.style.display = "none";
    start = new Date();
    end = new Date();
    end.setSeconds(end.getSeconds() + WAIT_TIME_SECS);
    localStorage.setItem("loading", "true");
    log("Starting Wait, ends in " + WAIT_TIME_SECS + "s.");
    startProgressBar(start.getTime(), end.getTime(), 100)
}

function closeProgressBar() {
    loadingView.style.display = "none";
    drawingView.style.display = "block";
    localStorage.setItem("loading", "false");
}

function startProgressBar(startTime, endTime, update) {

    var timer;
    var progressBar = document.getElementById("progressbar");
    var maxTime = endTime - startTime;
    title.textContent = "Identifying Categories...";

    var setValue = function () {
        var currentTime = new Date().getTime();
        var ellaspedTime = currentTime - startTime;

        if (ellaspedTime >= maxTime) {
            ellaspedTime = maxTime;
            window.clearTimeout(timer);
            closeProgressBar();
        } else if (ellaspedTime >= maxTime / 2) {
            title.textContent = "Drawing the Categories..."
        }

        var percent = (ellaspedTime / maxTime * 100).toFixed(0) + "%";
        progressBar.textContent = percent;
        progressBar.style.width = percent;
    }

    setValue();
    timer = window.setInterval(setValue, update);
    return
}

$("#skip_btn").on('click', () => {
    log("Skipping Wait.");
    closeProgressBar();
});