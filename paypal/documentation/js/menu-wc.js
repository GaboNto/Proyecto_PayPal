'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">paypal documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BalanceComponent.html" data-type="entity-link" >BalanceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChatBubbleComponent.html" data-type="entity-link" >ChatBubbleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfiguracionComponent.html" data-type="entity-link" >ConfiguracionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DondeComprarComponent.html" data-type="entity-link" >DondeComprarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FinancialGoalsComponent.html" data-type="entity-link" >FinancialGoalsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ForgotPasswordComponent.html" data-type="entity-link" >ForgotPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Google2faComponent.html" data-type="entity-link" >Google2faComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MovimientosComponent.html" data-type="entity-link" >MovimientosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PayComponent.html" data-type="entity-link" >PayComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PreRegistroComponent.html" data-type="entity-link" >PreRegistroComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileComponent.html" data-type="entity-link" >ProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterComponent.html" data-type="entity-link" >RegisterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" >ResetPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SecurityComponent.html" data-type="entity-link" >SecurityComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SeguridadPublicaComponent.html" data-type="entity-link" >SeguridadPublicaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidebarComponent.html" data-type="entity-link" >SidebarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TarjetasComponent.html" data-type="entity-link" >TarjetasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TarjetasPublicaComponent.html" data-type="entity-link" >TarjetasPublicaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TransactionsComponent.html" data-type="entity-link" >TransactionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VentajasComponent.html" data-type="entity-link" >VentajasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VerifyDisable2faComponent.html" data-type="entity-link" >VerifyDisable2faComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VerifyEmailComponent.html" data-type="entity-link" >VerifyEmailComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CardService.html" data-type="entity-link" >CardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CuentasService.html" data-type="entity-link" >CuentasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DestinatariosService.html" data-type="entity-link" >DestinatariosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LanguageService.html" data-type="entity-link" >LanguageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MovimientosService.html" data-type="entity-link" >MovimientosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SaldoService.html" data-type="entity-link" >SaldoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransferService.html" data-type="entity-link" >TransferService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/JwtInterceptor.html" data-type="entity-link" >JwtInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Card.html" data-type="entity-link" >Card</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Card-1.html" data-type="entity-link" >Card</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Comercio.html" data-type="entity-link" >Comercio</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cuenta.html" data-type="entity-link" >Cuenta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cuenta-1.html" data-type="entity-link" >Cuenta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CuentaConTarjeta.html" data-type="entity-link" >CuentaConTarjeta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Destinatario.html" data-type="entity-link" >Destinatario</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FinancialGoal.html" data-type="entity-link" >FinancialGoal</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Language.html" data-type="entity-link" >Language</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MovimientoHistorialDto.html" data-type="entity-link" >MovimientoHistorialDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PagoAutomatico.html" data-type="entity-link" >PagoAutomatico</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Translations.html" data-type="entity-link" >Translations</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserProfile.html" data-type="entity-link" >UserProfile</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/FormatCardNumberPipe.html" data-type="entity-link" >FormatCardNumberPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});