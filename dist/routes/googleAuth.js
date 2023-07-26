"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const CLIENT_URL = "https://little-programmer.netlify.app/";
const router = express_1.default.Router();
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            //   cookies: req.cookies
        });
    }
});
router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});
router.get("/logout", (req, res) => {
    req.logout((err) => res.send(err));
    res.redirect(CLIENT_URL);
});
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile"] }));
router.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
}));
exports.googleAuthRoutes = router;
