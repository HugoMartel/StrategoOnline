let Toast = (function() {

    //Consts
    const duration = "duration: 2500";
    const position = "position: {x: 'center', y: 'top'}";

    // Nested functions
    let errorCall = function(message) {
        return `<script>let notyf = new Notyf({${duration}, ${position}}); notyf.error('${message}');</script>`;
    };

    //Returned object
    return {
        error: message => errorCall(message),
    }
})();

module.exports = Toast;