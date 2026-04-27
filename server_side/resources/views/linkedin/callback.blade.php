<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <script>
      (function () {
        const payload = @json($payload);
        const origin = @json($frontendOrigin);

        if (window.opener) {
          window.opener.postMessage({ type: "linkedin-profile", payload }, origin);
          setTimeout(() => window.close(), 50);
        } else {
          document.body.innerText = "No opener window found. Please go back to the app.";
        }
      })();
    </script>
  </body>
</html>
