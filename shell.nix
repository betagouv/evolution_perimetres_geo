with import <nixpkgs> {};
let
  unstable = import <nixos-unstable> {};
in
stdenv.mkDerivation {
    name = "node";
    buildInputs = [
        (yarn.override { nodejs = null; })
        nodejs-14_x
        p7zip
    ];

    shellHook = ''
    '';
}