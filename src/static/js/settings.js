/* ---------------
 *  Settings
 * ---------------*/

var settingsBtn = document.getElementById("settings_btn");
var settingsModal = document.getElementById('settingsModal');

settingsModal.addEventListener('shown.bs.modal', function (event) {
    $("#pesudoInput").val(localStorage.getItem("pseudonym"));
    $("#roundInput").val(localStorage.getItem("round"));
    $("#versionSelect").val(localStorage.getItem("versionInput"));
});

$("#settingsForm").on('submit', () => {
    localStorage.setItem("pseudonym", $("#pesudoInput").val());
    localStorage.setItem("round", $("#roundInput").val());
    localStorage.setItem("versionInput", $("#versionSelect").val());
});

$("#settingsSubmit").on('click', () => {
    $("#settingsForm").submit();
    var modal = new bootstrap.Modal(settingsModal);
    modal.hide();
});


