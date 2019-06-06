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

action "npm install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["create release"]
  args = "install --unsafe-perm"
}

action "npm run build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["npm install"]
  args = "run build --unsafe-perm"
}

action "upload to release" {
  uses = "./.github/append-assets"
  needs = ["npm run build"]
  secrets = ["GITHUB_TOKEN"]
}
