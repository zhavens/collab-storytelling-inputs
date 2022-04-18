/* ---------------
 *  PROGRESS BAR
 * ---------------*/
import { log } from "./logging.js";
var loadingView = document.getElementById("loading-view");
var drawingView = document.getElementById("drawing-view");
var title = document.getElementById("title");
var start;
var end;

export function setUpProgressBar() {
    loadingView.style.display = "block";
    drawingView.style.display = "none";
    start = new Date();
    end = new Date();
    end.setSeconds(end.getSeconds() + 35);
    localStorage.setItem("loading", "true");
    log("Starting Wait: " + start);
    log("Ending Wait: " + end);
    startProgressBar(start.getTime(), end.getTime(), 100)
}

function startProgressBar(startTime, endTime, update) {

    var timer;
    var progressBar = document.getElementById("progressbar");
    var maxTime = endTime - startTime;
    title.textContent = "Identifying Categories...";
  
    var setValue = function() {
        var currentTime = new Date().getTime();
        var ellaspedTime = currentTime - startTime;
        
        if (ellaspedTime >= maxTime) {
            ellaspedTime = maxTime;
            window.clearTimeout(timer);
            loadingView.style.display = "none";
            drawingView.style.display = "block";
            localStorage.setItem("loading", "false");
        } else if (ellaspedTime >= maxTime/2) {
            title.textContent = "Drawing the Categories..."
        }
        
        var percent = (ellaspedTime/maxTime * 100).toFixed(0) + "%";
        progressBar.textContent = percent;
        progressBar.style.width = percent;
    }
  
    setValue();
    timer = window.setInterval(setValue, update);
    return
}