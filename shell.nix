with import <nixpkgs> {};
let
  unstable = import <nixos-unstable> {};
in
stdenv.mkDerivation {
    name = "node";
    buildInputs = [
        (yarn.override { nodejs = null; })
        nodejs-16_x
        p7zip
        minio-client
    ];

    shellHook = ''
    '';
}
