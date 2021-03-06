import postcss from "postcss";

interface ComposeElectronsOptions {
  module: string;
}

const composeElectrons = postcss.plugin<ComposeElectronsOptions>(
  "compose-electrons",
  config => css => {
    const { module } = config || { module: "" };
    css.walkDecls(decl => {
      if (decl.prop === "electrons") {
        const re = new RegExp(/\s*\(([\s\S]*)\)/, "g");
        const match = re.exec(decl.value);
        const content = match ? match[1] : "";
        const electrons = content.split(/[\s,]+/g).filter(el => el);

        if (electrons.length > 0) {
          decl.replaceWith({
            prop: "composes",
            value: `${electrons.join(" ")} from "${module}"`
          });
        } else {
          decl.remove();
        }
      }
    });
  }
);

export default composeElectrons;
