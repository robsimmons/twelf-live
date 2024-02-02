let incremental: boolean = false;

const primaryView = document.getElementById(
  "primary-view"
) as HTMLTextAreaElement;

const incrementalView = document.getElementById(
  "incremental-view"
) as HTMLTextAreaElement;

const twelfResponse = document.getElementById(
  "twelf-response"
) as HTMLTextAreaElement;

const incrementalToggle = document.getElementById(
  "show-incremental-view"
) as HTMLInputElement;

const checkButton = document.getElementById(
  "check-button"
) as HTMLButtonElement;

incrementalToggle.onchange = () => {
  incremental = incrementalToggle.checked;
  document.getElementById("incremental-view-wrap")!.className = incremental
    ? "wrap"
    : "wrap-hidden";
};

checkButton.onclick = () => {
  twelfResponse.value = "";
  const body = incremental
    ? `${primaryView.value}\0${incrementalView.value}`
    : primaryView.value;
  console.log(body);
  fetch("https://twelf-live-worker.onrender.com/eval", { method: "POST", body })
    .then((response) => response.json())
    .then((response) => {
      if (response.error) {
        twelfResponse.value = response.msg;
      } else {
        twelfResponse.value = `${response.output}\n${
          response.killed ? "%% TIMEOUT %%" : response.server
        }`;
      }
    });
};

/* Attempt to wake up server */
fetch("https://twelf-live-worker.onrender.com/eval", {
  method: "POST",
  body: "nat: type.",
})
  .then((response) => response.json())
  .then((response) => {
    console.log(`Server responded ${response.server ?? "incorrectly"}`);
  });
