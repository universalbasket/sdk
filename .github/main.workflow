workflow "Make release from tag." {
  on = "push"
  resolves = ["Make release from tag: Upload assets"]
}

action "Make release from tag: only tags" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "tag"
}

action "Make release from tag: create release" {
  uses = "./.github/create-release"
  needs = ["Make release from tag: only tags"]
  secrets = ["GITHUB_TOKEN"]
}

action "Make release from tag: npm install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Make release from tag: create release"]
  args = "install --unsafe-perm"
}

action "Make release from tag: npm run build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run build --unsafe-perm"
  needs = ["Make release from tag: npm install"]
}

action "Make release from tag: Upload assets" {
  uses = "./.github/append-assets"
  secrets = ["GITHUB_TOKEN"]
  needs = ["Make release from tag: npm run build"]
}

workflow "Pull request." {
  on = "pull_request"
  resolves = ["Pull request: npm test", "Pull request: npm run check"]
}

action "Pull request: opened or synchronize" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "action 'opened|synchronize'"
}

action "Pull request: npm install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
  needs = ["Pull request: opened or synchronize"]
}

action "Pull request: npm test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "test"
  needs = ["Pull request: npm install"]
}

action "Pull request: npm run check" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Pull request: npm install"]
  args = "run check"
}
