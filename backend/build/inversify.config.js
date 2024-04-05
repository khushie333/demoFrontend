"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iocContainer = void 0;
const inversify_1 = require("inversify");
const connectDB_1 = require("./config/connectDB");
// import { UserService } from './service/user/user.service'
// import { ArticleService } from './service/article/article.service'
// Load everything needed to the Container
exports.iocContainer = new inversify_1.Container();
// Services
exports.iocContainer.bind(connectDB_1.AppConfig).to(connectDB_1.AppConfig).inSingletonScope();
// iocContainer
// 	.bind<UserService>(TYPES.UserService)
// 	.to(UserService)
// 	.inSingletonScope()
