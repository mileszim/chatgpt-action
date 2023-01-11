const core = require("@actions/core");

const { createChatGPTAPI } = require("./chatgpt");
const { runPRReview, runPRSummary } = require("./run");

// most @actions toolkit packages have async methods
async function run () {
  try {
    const number = parseInt(core.getInput("number"));
    const sessionToken = core.getInput("sessionToken");
    const mode = core.getInput("mode");
    const split = core.getInput("split");
    const operation = core.getInput("operation");

    // Get current repo.
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    // Create ChatGPT API
    const api = await createChatGPTAPI(sessionToken);

    if (mode == "pr") {
      if (operation === "summarize") {
        runPRSummary({ api, owner, repo, number });
      } else {
        runPRReview({ api, owner, repo, number, split });
      }
    } else if (mode == "issue") {
      throw "Not implemented!";
    } else {
      throw `Invalid mode ${mode}`;
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
