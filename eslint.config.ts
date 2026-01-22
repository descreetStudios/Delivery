// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    rules: {
        // Line endings CRLF
        "linebreak-style": ["error", "windows"],

        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "comma-dangle": ["error", "always-multiline"],
        "indent": ["error", "tab", { "SwitchCase": 1, "tabWidth": 4 }],

        // Vue
        "vue/html-indent": ["error", "tab", { "baseIndent": 1 }],
        "vue/script-indent": ["error", "tab", { "baseIndent": 0 }],
        "vue/max-attributes-per-line": ["error", {
            singleline: 1,
            multiline: 1,
        }],
        "vue/html-closing-bracket-newline": ["error", {
            singleline: "never",
            multiline: "always",
        }],
        "vue/html-closing-bracket-spacing": ["error", {
            startTag: "never",
            endTag: "never",
            selfClosingTag: "always",
        }],
        "vue/singleline-html-element-content-newline": "off",
        "vue/multiline-html-element-content-newline": "off",
    },
});
