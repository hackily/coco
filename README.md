# CoCo, the Common Codec

### Getting started

Download and install the CoCo CLI from npm.

> npm install common-codec-cli

### Use

CoCo is a command line interface that requires 3 inputs as arguments - action, codec, and input.

Action can be encode or decode
Codec is one of jwt, base64, hex, uri, binary, or ascii
Input is the string of text that you want to convert.

    coco <action> <codec> <input> <option>

Eg

    coco encode base64 myclientid:myclientsecret
    bXljbGllbnRpZDpteWNsaWVudHNlY3JldA==
    
    coco decode jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ
    {
      "sub": "1234567890",
      "name": "John Doe",
      "admin": true
    }
    
    coco decode hex 0011aa
    4522
    
    coco decode hex 0011aa rgb
    0 17 170
