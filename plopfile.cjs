module.exports = function Plopfile(plop) {
  plop.setGenerator("component", {
    description: "Create a component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name",
      },
    ],
    actions: [
      {
        type: "add",
        path: "./components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop/component/Component.tsx.hbs",
      },
      {
        type: "add",
        path: "./components/{{pascalCase name}}/index.ts",
        templateFile: "plop/component/index.ts.hbs",
      },
      {
        type: "add",
        path: "./components/{{pascalCase name}}/{{pascalCase name}}.styles.ts",
        templateFile: "plop/component/Component.styles.ts.hbs",
      },
      {
        type: "add",
        path: "./components/{{pascalCase name}}/{{pascalCase name}}.types.ts",
        templateFile: "plop/component/Component.types.ts.hbs",
      },
      {
        type: "add",
        path: "./components/{{pascalCase name}}/{{pascalCase name}}.spec.tsx",
        templateFile: "plop/component/Component.spec.tsx.hbs",
      },
    ],
  });
  plop.setGenerator("template", {
    description: "Create a template",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name",
      },
    ],
    actions: [
      {
        type: "add",
        path: "./templates/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "plop/template/Component.tsx.hbs",
      },
      {
        type: "add",
        path: "./templates/{{pascalCase name}}/{{pascalCase name}}.provider.tsx",
        templateFile: "plop/template/Component.provider.tsx.hbs",
      },
      {
        type: "add",
        path: "./templates/{{pascalCase name}}/{{pascalCase name}}.component.tsx",
        templateFile: "plop/template/Component.component.tsx.hbs",
      },
      {
        type: "add",
        path: "./templates/{{pascalCase name}}/index.ts",
        templateFile: "plop/template/index.ts.hbs",
      },
      {
        type: "add",
        path: "./templates/{{pascalCase name}}/{{pascalCase name}}.styles.ts",
        templateFile: "plop/template/Component.styles.ts.hbs",
      },
      {
        type: "add",
        path: "./templates/{{pascalCase name}}/{{pascalCase name}}.types.ts",
        templateFile: "plop/template/Component.types.ts.hbs",
      },
      {
        type: "add",
        path: "./templates/{{pascalCase name}}/{{pascalCase name}}.spec.tsx",
        templateFile: "plop/template/Component.spec.tsx.hbs",
      },
    ],
  });
};
