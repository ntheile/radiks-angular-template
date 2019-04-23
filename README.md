# Radiks Shim for Angular

1. Copy `src/assets/radiks-shim` to `node_modules` to make radiks work in angular projects. I had to create node_modules/radiks-shim/index.js to port stuff over to typescript to handle angular errors

make sure your tsconfig.json looks like this. notice the paths

```
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "noImplicitAny": false,    
    "allowSyntheticDefaultImports": true,
    "target": "es5",
    "allowJs": true,
    "baseUrl": "./",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2017",
      "dom"
    ],
    "paths": {
      "crypto": [
          "../node_modules/crypto-browserify"
      ],
      "stream": [
        "../node_modules/stream-browserify"
      ],
      // "buffer": [
      //   "../node_modules/buffer-browserify"
      // ],
      "radiks": [
        "../node_modules/radiks"      
      ]
    }
  }
}

```

2. had to modify  node_modules/radiks/libmodels/group-invitation.js

`make invitation function`

```
  signingKeyPrivateKey: userGroup.getSigningKey().privateKey,
```

3. Make sure to call getGroups before you accept an invitation

```
  async getMyGroups() {
    const groups = await UserGroup.myGroups();
    console.log('myGroups', groups);
  }
```