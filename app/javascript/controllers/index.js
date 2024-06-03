
import { application } from "./application"
import CodeSyntax from "./code_syntax_controller"
import HomeController from "./home_controller"
import TabsController from "./tabs_controller"

application.register("code-syntax", CodeSyntax)
application.register("home", HomeController)
application.register("tabs", TabsController)
