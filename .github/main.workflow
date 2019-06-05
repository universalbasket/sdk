workflow "Append build.js to release." {
  resolves = ["upload to release"]
  on = "release"
}

action "npm install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "npm run build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["npm install"]
  args = "run build"
}

action "upload to release" {
  uses = "JasonEtco/upload-to-release@f6be50515ab654bbbe5265afcf9acd97385b694c"
  needs = ["npm run build"]
  args = "build.js text/javascript"
  secrets = ["GITHUB_TOKEN"]
}
