workflow "Make release from tag." {
  on = "push"
  resolves = ["upload to release"]
}

action "only tags" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "tag"
}

action "create release" {
  uses = "./.github/create-release/"
  needs = ["only tags"]
  secrets = ["GITHUB_TOKEN"]
}

action "npm install for release" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["create release"]
  args = "install --unsafe-perm"
}

action "npm run build for release" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run build --unsafe-perm"
  needs = ["npm install for release"]
}

action "upload to release" {
  uses = "./.github/append-assets"
  secrets = ["GITHUB_TOKEN"]
  needs = ["npm run build for release"]
}

workflow "Pull request." {
  on = "pull_request"
  resolves = ["npm test for pull request", "npm run check for pull request"]
}

action "opened or edited" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "action 'opened|edited'"
}

action "npm install for pull request" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
  needs = ["opened or edited"]
}

action "npm test for pull request" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "test"
  needs = ["npm install for pull request"]
}

action "npm run check for pull request" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["npm install for pull request"]
  args = "run check"
}
