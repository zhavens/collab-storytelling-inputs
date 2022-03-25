/* ---------------
 *  PROGRESS BAR
 * ---------------*/

function setUpProgressBar(startTime, endTime, update) {

    var timer;
    var progressBar = document.getElementById("progressbar");
    var maxTime = endTime - startTime;
  
    var setValue = function() {
        var currentTime = new Date().getTime();
        var ellaspedTime = currentTime - startTime;
        
        if (ellaspedTime >= maxTime) {
            ellaspedTime = maxTime;
            window.clearTimeout(timer);
            window.location.replace("output.html");
        }
        
        var percent = (ellaspedTime/maxTime * 100).toFixed(0) + "%";
        progressBar.textContent = percent;
        progressBar.style.width = percent;
    }
  
    setValue();
    timer = window.setInterval(setValue, update);
    return
}
  
var start = new Date();
var end = new Date();
end.setSeconds(end.getSeconds() + 5);

setUpProgressBar(start.getTime(), end.getTime(), 100)