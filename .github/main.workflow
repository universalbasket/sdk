workflow "Append build.js to release." {
  resolves = ["upload to release"]
  on = "release"
}

action "npm install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install --unsafe-perm"
}

action "npm run build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["npm install"]
  args = "run build --unsafe-perm"
}

action "upload to release" {
  uses = "JasonEtco/upload-to-release@f6be50515ab654bbbe5265afcf9acd97385b694c"
  needs = ["npm run build"]
  args = "build.js text/javascript"
  secrets = ["GITHUB_TOKEN"]
}

workflow "Make release from tag." {
  on = "push"
  resolves = ["create release"]
}

action "only tags" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  args = "tag"
}

action "create release" {
  uses = "frankjuniorr/github-create-release-action@59ba1aefc810587252089c0f61c979584ec8e2c9"
  needs = ["only tags"]
  secrets = ["GITHUB_TOKEN"]
}
