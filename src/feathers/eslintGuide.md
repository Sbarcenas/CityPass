## Mac eslint + prettier instalation guide.

Lo primero que hay que tener en cuenta es que podemos installar tanto global como localmente, estos complementos  
en este caso lo realizaremos localmente.

Para esto: 

1. Instalamos eslint

´´´
yarn add eslint -D
´´´

2. Instalamos la configuración de slint de airbnb 
```
yarn add eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react -D
```

3. En el directorio raiz de nuestro proyecto actual creamos el archivo

.eslintrc

```
{
  "extends": [
    "airbnb"
  ]
}
``` 

4. Instalamos Prettier en nuestro proyecto

```
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

5. actualizamos el archivo .eslintrc, con las siguientes lineas

```
{
  "extends": [
    "airbnb",
    "prettier",
    "prettier/react"
  ],
  "rules": {
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    ],
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 100
      }
    ]
  },
  "plugins": [
    "prettier"
  ]
}
```
6. En visual Studio en users settings vamos a añadir

```
{
  // other settings
  // formatting using eslint
  // let editor format using prettier for all other files
  "editor.formatOnSave": true,
  // disable editor formatting, so eslint can handle it
  "[javascript]": {
    "editor.formatOnSave": false,
  },
  // available through eslint plugin in vscode
  "eslint.autoFixOnSave": true,
  "eslint.alwaysShowStatus": true,
}s
```