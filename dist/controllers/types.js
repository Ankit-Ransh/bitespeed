"use strict";
/**
 * Types for Contact Identification API
 *
 * This module defines the types used throughout the contact identification service.
 *
 * @author Ankit Anand
 * @module controllers/types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkPrecedence = void 0;
/**
 * Enum representing the precedence of a contact
 * PRIMARY: Original/main contact record
 * SECONDARY: Linked contact record that points to a primary
 */
var LinkPrecedence;
(function (LinkPrecedence) {
    LinkPrecedence["PRIMARY"] = "primary";
    LinkPrecedence["SECONDARY"] = "secondary";
})(LinkPrecedence || (exports.LinkPrecedence = LinkPrecedence = {}));
//# sourceMappingURL=types.js.map