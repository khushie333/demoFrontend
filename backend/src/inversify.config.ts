import { Container } from 'inversify'
import TYPES from './constatnts/types.constants'
import { AppConfig } from './config/connectDB'
// import { UserService } from './service/user/user.service'
// import { ArticleService } from './service/article/article.service'

// Load everything needed to the Container
export const iocContainer = new Container()

// Services
iocContainer.bind<AppConfig>(AppConfig).to(AppConfig).inSingletonScope()
// iocContainer
// 	.bind<UserService>(TYPES.UserService)
// 	.to(UserService)
// 	.inSingletonScope()
