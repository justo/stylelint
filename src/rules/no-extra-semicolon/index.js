import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "no-extra-semicolon"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected extra semicolon",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (decl.prop.indexOf("//") === 0) {
        report({
          message: messages.rejected,
          node: decl,
          result,
          ruleName,
        })
      }
    })
    root.walkRules(rule => {
      rule.selectors.forEach(selector => {
        if (selector.indexOf("//") === 0) {
          report({
            message: messages.rejected,
            node: rule,
            result,
            ruleName,
          })
        }
      })
    })
  }
}
