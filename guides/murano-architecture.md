# Murano Architectural Overview

![murano overview image](/assets/platform_overview.png)

As described in the [overview](/), Murano has three main parts to its "marketecture" (shown above) - the connected business, the connected solution, and the connected product.  When we made Murano, we had years of experience in IoT Platform technologies, and realized that the current IoT Platforms on the market (including ours!) had a fatal flaw: they assumed that the developer was either from the embedded/system-integration world, or from the web services world.  Not only did this flaw create difficulties for the way that IoT systems were designed, it also created serious ramifications for businesses hoping to create economic leverage from real-world connectivity.  They were stuck with creating one-hit wonder vertical solutions that could not reach adjacent markets, or they created feature-depleted cloud gateways and forever delayed the burden of business value creation, or they found their NPI/product development lifecycle suddenly shackled by the pace of traditional IT deployments.  At an architectural level, we addressed these major business-value creation roadblocks within the user experience & work flows - providing the right level of determination for the different IoT stakeholder personas.  Product development teams can create their Product-as-a-Service, business development teams can deploy internal & external teams to consume those Products in business-value-creating Solutions, while the business & IT stakeholders have the insight & integrations they need to embrace IoT as enterprise software just like their CRM/ERP/MRP/etc... systems.

## Architecture

At its core, Murano is composed of micro-services oriented around providing scalable, secure, and maintainable features, composed together in an opinionated way that allows OEMs to immediately begin creating connected products and value added connected services & solutions.  A high level diagram of this micro-services oriented architecture is shown below:


![murano architecture image](/assets/platform_architecture.png)


DANW -> TEXT ABOUT why this way is better than stand-alone composable web services, yet allows you to use composable web services as needed.

## Technologies

Murano uses a number of languages, frameworks, and services.  Although not exclusively, we are a big python house, use React/Redux extensively, deploy Erlang into certain environments, leverage distributed data base technologies like Casandra & MongoDB, and use Lua in our stream event driven filters & analytics.  Each technology is carefully selected based on scalability, efficiency, developer pool, and external adoption/familiarity.  We will sometimes use technologies, like Lua, that have phenomenal advantages for their use-case in terms of efficiencies that we pass along to our customers in the form of cost savings.  

