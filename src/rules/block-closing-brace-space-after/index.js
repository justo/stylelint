import {
  cssStatementBlockString,
  cssStatementHasBlock,
  report,
  rawNodeString,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "block-closing-brace-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \"}\"",
  rejectedAfter: () => "Unexpected whitespace after \"}\"",
  expectedAfterSingleLine: () => "Expected single space after \"}\" of a single-line block",
  rejectedAfterSingleLine: () => "Unexpected whitespace after \"}\" of a single-line block",
  expectedAfterMultiLine: () => "Expected single space after \"}\" of a multi-line block",
  rejectedAfterMultiLine: () => "Unexpected whitespace after \"}\" of a multi-line block",
})

export default function (expectation) {

  const checker = whitespaceChecker("space", expectation, messages)

  return function (root, result) {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-single-line",
        "never-single-line",
        "always-multi-line",
        "never-multi-line",
      ],
    })
    if (!validOptions) { return }

    // Check both kinds of statements: rules and at-rules
    root.walkRules(check)
    root.walkAtRules(check)

    function check(statement) {
      const nextNode = statement.next()
      if (!nextNode) { return }
      if (!cssStatementHasBlock(statement)) { return }

      checker.after({
        source: rawNodeString(nextNode),
        index: -1,
        lineCheckStr: cssStatementBlockString(statement),
        err: msg => {
          report({
            message: msg,
            node: statement,
            index: statement.toString().length,
            result,
            ruleName,
          })
        },
      })
    }
  }
}
