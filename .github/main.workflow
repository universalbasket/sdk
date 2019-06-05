workflow "Append build.js to release." {
  resolves = ["upload to release"]
  on = "release"
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "run build"
}

action "upload to release" {
  uses = "JasonEtco/upload-to-release@f6be50515ab654bbbe5265afcf9acd97385b694c"
  needs = ["GitHub Action for npm"]
  args = "build.js text/javascript"
  secrets = ["GITHUB_TOKEN"]
}
