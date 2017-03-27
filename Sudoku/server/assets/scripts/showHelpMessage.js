(function() {
    var snackbarContainer = document.querySelector('#toast');
    var showToastButton = document.querySelector('#show-toast');
    showToastButton.addEventListener('click', function() {
        var data = {message: 'Veuillez rafraîchir la page pour mettre à jour les données sur le jeu '};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
}());