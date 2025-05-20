const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  // Modo de desarrollo - puedes cambiarlo a 'production' para producción
  mode: 'development',

  // Punto de entrada de tu aplicación
  entry: './src/renderer/index.jsx',

  // Donde se generará el bundle
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true // Limpia la carpeta dist antes de cada build
  },

  // Configuración del servidor de desarrollo
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    open: true, // Abre el navegador automáticamente
    hot: true // Habilita Hot Module Replacement
  },

  // Reglas para procesar diferentes tipos de archivos
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Agrega esta regla para TypeScript
        exclude: /node_modules/,
        use: 'ts-loader' // Usa ts-loader para TypeScript
      },
      // Regla para archivos JavaScript/JSX
      {
        test: /\.(js|mjs|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      // Regla para archivos CSS
      {
        test: /\.css$/,
        use: ['style-loader', 
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader']
      },
      // Regla para imágenes
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },

  // Extensiones que webpack debe resolver automáticamente
  resolve: {
    extensions: ['.js', '.jsx','.ts', '.tsx']
  },

  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html', // Ruta a tu archivo HTML template
      filename: 'index.html'
    }),
     new webpack.IgnorePlugin({
      resourceRegExp: /typescript\/lib\/typescript\.js/,
      contextRegExp: /node_modules/,
    }), 

  ],
  ignoreWarnings: [
    {
      module: /typescript\.js/,
      message: /Critical dependency: the request of a dependency is an expression/
    }
  ]
};
