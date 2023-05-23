"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../_styles/common");
const _mixins_1 = require("../../_mixins");
const styles_1 = require("../../avatar/styles");
const avatarGroupLight = (0, _mixins_1.createTheme)({
    name: 'AvatarGroup',
    common: common_1.commonLight,
    peers: {
        Avatar: styles_1.avatarLight
    }
});
exports.default = avatarGroupLight;
