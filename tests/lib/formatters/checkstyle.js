/**
 * @fileoverview Tests for checkstyle reporter.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    formatter = require("../../../lib/formatters/checkstyle");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:checkstyle", function() {
    describe("when passed a single message", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the format filename: line x, col y, Error - z for errors", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo. (foo)\" /></file></checkstyle>");
        });

        it("should return a string in the format filename: line x, col y, Warning - z for warnings", function() {
            code[0].messages[0].severity = 1;
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"warning\" message=\"Unexpected foo. (foo)\" /></file></checkstyle>");
        });
    });

    describe("when passed a message with XML control characters", function() {
        var code = [{
            filePath: "<>&\"'.js",
            messages: [{
                fatal: true,
                message: "Unexpected <>&\"'.",
                line: "<",
                column: ">",
                ruleId: "foo"
            }]
        }];

        it("should return a string in the format filename: line x, col y, Error - z", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"&lt;&gt;&amp;&quot;&apos;.js\"><error line=\"&lt;\" column=\"&gt;\" severity=\"error\" message=\"Unexpected &lt;&gt;&amp;&quot;&apos;. (foo)\" /></file></checkstyle>");
        });
    });

    describe("when passed a fatal error message", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in the format filename: line x, col y, Error - z", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo. (foo)\" /></file></checkstyle>");
        });
    });

    describe("when passed multiple messages", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }, {
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }];

        it("should return a string with multiple entries", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo. (foo)\" /><error line=\"6\" column=\"11\" severity=\"warning\" message=\"Unexpected bar. (bar)\" /></file></checkstyle>");
        });
    });

    describe("when passed multiple files with 1 message each", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: [{
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar"
            }]
        }];

        it("should return a string with multiple entries", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo. (foo)\" /></file><file name=\"bar.js\"><error line=\"6\" column=\"11\" severity=\"warning\" message=\"Unexpected bar. (bar)\" /></file></checkstyle>");
        });
    });

    describe("when passing single message without rule id", function() {
        var code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10
            }]
        }];

        it("should return a string in the format filename: line x, col y, Error - z for errors", function() {
            var result = formatter(code);
            assert.equal(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle version=\"4.3\"><file name=\"foo.js\"><error line=\"5\" column=\"10\" severity=\"error\" message=\"Unexpected foo.\" /></file></checkstyle>");
        });
    });
});
