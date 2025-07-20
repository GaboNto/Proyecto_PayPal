--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-07-19 21:03:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 49819)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 49830)
-- Name: card; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.card (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "cardNumber" character varying(16) NOT NULL,
    cvv character varying(3) NOT NULL,
    "expirationDate" character varying NOT NULL,
    is_blocked boolean DEFAULT false NOT NULL,
    id_cuenta integer
);


ALTER TABLE public.card OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 49837)
-- Name: cuentas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuentas (
    id integer NOT NULL,
    numero_cuenta character varying(30) NOT NULL,
    tipo_cuenta character varying(50) DEFAULT 'Cuenta Vista'::character varying NOT NULL,
    saldo numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    fecha_apertura timestamp without time zone DEFAULT now() NOT NULL,
    id_usuario integer
);


ALTER TABLE public.cuentas OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 49843)
-- Name: cuentas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cuentas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cuentas_id_seq OWNER TO postgres;

--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 220
-- Name: cuentas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuentas_id_seq OWNED BY public.cuentas.id;


--
-- TOC entry 221 (class 1259 OID 49844)
-- Name: destinatarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destinatarios (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    rut character varying NOT NULL,
    alias character varying,
    correo_electronico character varying,
    banco character varying NOT NULL,
    tipo_cuenta character varying NOT NULL,
    numero_cuenta character varying NOT NULL,
    es_favorito boolean DEFAULT false NOT NULL,
    propietario_id integer NOT NULL
);


ALTER TABLE public.destinatarios OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 49850)
-- Name: destinatarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.destinatarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.destinatarios_id_seq OWNER TO postgres;

--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 222
-- Name: destinatarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.destinatarios_id_seq OWNED BY public.destinatarios.id;


--
-- TOC entry 223 (class 1259 OID 49851)
-- Name: movimientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimientos (
    id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    type character varying NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    "cuentaId" integer
);


ALTER TABLE public.movimientos OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 49857)
-- Name: movimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movimientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movimientos_id_seq OWNER TO postgres;

--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 224
-- Name: movimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimientos_id_seq OWNED BY public.movimientos.id;


--
-- TOC entry 232 (class 1259 OID 58330)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    id integer NOT NULL,
    idusuario integer NOT NULL,
    monto integer NOT NULL,
    descripcion text NOT NULL,
    categoria character varying(100) NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 58329)
-- Name: pagos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_id_seq OWNER TO postgres;

--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 231
-- Name: pagos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_id_seq OWNED BY public.pagos.id;


--
-- TOC entry 225 (class 1259 OID 49858)
-- Name: transferencias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transferencias (
    id integer NOT NULL,
    usuario_id_origen integer NOT NULL,
    id_usuario_destino integer,
    id_usuario_externo integer,
    monto integer NOT NULL,
    comision integer DEFAULT 0 NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.transferencias OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 49863)
-- Name: transferencias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transferencias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transferencias_id_seq OWNER TO postgres;

--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 226
-- Name: transferencias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transferencias_id_seq OWNED BY public.transferencias.id;


--
-- TOC entry 227 (class 1259 OID 49864)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying NOT NULL,
    apellido character varying NOT NULL,
    correo_electronico character varying NOT NULL,
    contrasena character varying NOT NULL,
    fecha_nacimiento date NOT NULL,
    pais character varying NOT NULL,
    ciudad character varying NOT NULL,
    rut character varying,
    banco character varying(50) DEFAULT 'Paypal'::character varying NOT NULL,
    bepass character varying,
    totp_secret character varying,
    email_verificado boolean DEFAULT false NOT NULL,
    direccion character varying,
    facturacion character varying,
    "2fa_enabled" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 49870)
-- Name: usuarios_externos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios_externos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    rut character varying(12) NOT NULL,
    banco character varying(50) NOT NULL,
    tipo_cuenta character varying(50) NOT NULL,
    numero_cuenta character varying(30) NOT NULL,
    saldo numeric(10,2) DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE public.usuarios_externos OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 49874)
-- Name: usuarios_externos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_externos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_externos_id_seq OWNER TO postgres;

--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 229
-- Name: usuarios_externos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_externos_id_seq OWNED BY public.usuarios_externos.id;


--
-- TOC entry 230 (class 1259 OID 49875)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 230
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 4688 (class 2604 OID 49876)
-- Name: cuentas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas ALTER COLUMN id SET DEFAULT nextval('public.cuentas_id_seq'::regclass);


--
-- TOC entry 4692 (class 2604 OID 49877)
-- Name: destinatarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinatarios ALTER COLUMN id SET DEFAULT nextval('public.destinatarios_id_seq'::regclass);


--
-- TOC entry 4694 (class 2604 OID 49878)
-- Name: movimientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos ALTER COLUMN id SET DEFAULT nextval('public.movimientos_id_seq'::regclass);


--
-- TOC entry 4705 (class 2604 OID 58333)
-- Name: pagos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN id SET DEFAULT nextval('public.pagos_id_seq'::regclass);


--
-- TOC entry 4696 (class 2604 OID 49879)
-- Name: transferencias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias ALTER COLUMN id SET DEFAULT nextval('public.transferencias_id_seq'::regclass);


--
-- TOC entry 4699 (class 2604 OID 49880)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 4703 (class 2604 OID 49881)
-- Name: usuarios_externos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_externos ALTER COLUMN id SET DEFAULT nextval('public.usuarios_externos_id_seq'::regclass);


--
-- TOC entry 4882 (class 0 OID 49830)
-- Dependencies: 218
-- Data for Name: card; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.card (id, "cardNumber", cvv, "expirationDate", is_blocked, id_cuenta) FROM stdin;
a415e9e2-f5f7-4f35-af02-84fe666617d1	2527817277755137	597	7/29	f	1
585c8181-2672-483b-abbd-9880c3956a04	1077805520243352	738	7/29	f	2
e93ebdcd-536c-4ffd-a96e-0aa0513e9407	2874795022043235	659	7/29	f	3
8dc4bf76-989a-45a5-aa13-a7f3e2f973ee	6773792190074583	753	7/29	f	4
a9c9f6e1-e4a6-4b91-9760-9940ffd3e9e4	6950186224256716	149	7/29	f	5
011d4aab-b71a-42f5-bd45-00e751fa7b91	5232773742621035	897	7/29	f	9
16809571-884a-4c66-9183-56685fdb7d9d	1426548096288356	240	7/29	f	10
323bb3ff-c23f-4ae8-aee7-4ec2e363bedd	9862887232753048	190	7/29	f	14
\.


--
-- TOC entry 4883 (class 0 OID 49837)
-- Dependencies: 219
-- Data for Name: cuentas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuentas (id, numero_cuenta, tipo_cuenta, saldo, fecha_apertura, id_usuario) FROM stdin;
3	105791831	Cuenta de Ahorro	52000.00	2025-07-05 10:08:14.495389	2
2	821051720	Cuenta Vista	40400.00	2025-07-05 10:06:10.205681	2
1	322305441	Cuenta Vista	3000.00	2025-07-04 18:25:11.334713	1
4	131583002	Cuenta de Ahorro	4000.00	2025-07-05 10:38:12.299791	1
5	109160078	Cuenta Vista	0.00	2025-07-05 18:46:03.520218	3
9	361305890	Cuenta Vista	0.00	2025-07-18 00:53:40.74815	7
10	393510564	Cuenta Vista	0.00	2025-07-18 18:33:56.547364	8
14	573895775	Cuenta Vista	0.00	2025-07-18 23:36:19.287737	12
\.


--
-- TOC entry 4885 (class 0 OID 49844)
-- Dependencies: 221
-- Data for Name: destinatarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destinatarios (id, nombre, rut, alias, correo_electronico, banco, tipo_cuenta, numero_cuenta, es_favorito, propietario_id) FROM stdin;
\.


--
-- TOC entry 4887 (class 0 OID 49851)
-- Dependencies: 223
-- Data for Name: movimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimientos (id, amount, type, date, "cuentaId") FROM stdin;
\.


--
-- TOC entry 4896 (class 0 OID 58330)
-- Dependencies: 232
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (id, idusuario, monto, descripcion, categoria, fecha) FROM stdin;
\.


--
-- TOC entry 4889 (class 0 OID 49858)
-- Dependencies: 225
-- Data for Name: transferencias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transferencias (id, usuario_id_origen, id_usuario_destino, id_usuario_externo, monto, comision, fecha) FROM stdin;
1	2	1	\N	2000	0	2025-07-05 10:19:31.139745
2	2	1	\N	2000	0	2025-07-05 10:39:00.751088
3	2	1	\N	3000	0	2025-07-05 10:42:46.445484
4	2	1	\N	2000	0	2025-07-05 10:47:26.820227
5	2	1	\N	4000	0	2025-07-05 10:48:48.877568
6	2	1	\N	1000	0	2025-07-05 10:55:32.567853
7	2	2	\N	3000	0	2025-07-05 11:26:37.765614
8	2	\N	8	3000	300	2025-07-05 11:33:05.854234
9	2	\N	8	1000	300	2025-07-05 11:34:09.951173
10	1	1	\N	2000	0	2025-07-05 11:36:06.168292
\.


--
-- TOC entry 4891 (class 0 OID 49864)
-- Dependencies: 227
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, nombre, apellido, correo_electronico, contrasena, fecha_nacimiento, pais, ciudad, rut, banco, bepass, totp_secret, email_verificado, direccion, facturacion, "2fa_enabled") FROM stdin;
3	ignacio	lopez	jettie.mills56@ethereal.email	$2b$10$9OkZcHTJH3/vaDG/YMr9QOihcxvJDCjuQqVrIC2WGd/w1tpVBYY3m	2000-07-19	chile	arica	10353408-9	Paypal	\N	\N	f	\N	\N	f
2	felipe	guzman	elbalazomaximo@gmail.com	$2b$10$/zzb.yD9bjPFJ/PK33n6K.AoZVArlOI3iLS/lH5QiAj2l0LQfTW.2	2000-07-19	chile	arica	20788117-1	Paypal	$2b$10$1p8ezCzBRkcyrJ3gzg69nezfFrXzF/AMUCKnqAPZyix7uKebfMsX6	\N	f	\N	\N	f
7	jorge	nitales	admin@hotel.com	$2b$10$ogyqLdP2sB84CjIMq7QH2O4ATWDwGyIzXve0auyGADTz0ByTqRNTa	2000-07-19	chile	arica	21369340-9	Paypal	$2b$10$tFkkU5tRpy4HnP97qleiHuv5ifvoJdV9JJ2Fs0maMFDlBpV3BKQFK	OVMFMIZEPIYH2RKXJQVDCW2BHY7F2SZGPFTF422CNBTGW3TFLYSQ	t	\N	\N	t
12	felipe	guzman	locaculia@gmail.com	$2b$10$zfPCPtjpfSKmckosDUa7N.8YVqYtOp/fan73pugH2F39WtqnoacxG	2000-07-19	chile	arica	20546510-3	Paypal	$2b$10$Q3MuZ9YDd3QlJZBwb09aHeHkaeG136QXGLHuY81bAHeOwsef6e/oe	HI4U25DDLJFTQYJPHBDHWNKBLNVXIXKOF5CTYU2XO5HFOI3QOVHA	f	a	a	f
1	bastian	sucso	elbalazoo@gmail.com	$2b$10$SW9coffiouNvYz05vk3WJeu2IQ.UkbhEwDe8pOLw3NIqCnQwtUBYa	2000-07-19	chile	arica	12610490-1	Paypal	$2b$10$usp6uwIVqJ2ibepOc5D5UeZHq10zvS/HvNDgrg0uEvlMktOpJcLEW	GIRTUTSLKRGHMXRQPBQTMNZSJVZVMKBSGY3USTSWGVEFARR7NA5A	t	Curiñanco	aaa	f
8	casino	arica	elsapo@gmail.com	$2b$10$ob4TT88iVQ6szaeTtI5ibeJL9o4IJhhVr4emcEN204b6N5o4uIY9u	2000-07-19	chile	arica	21201516-4	Paypal	$2b$10$jCJnYOfxwnAJJXJ8JZYN4uU6ZgW0khGkju3s4F4FLakT6.OHeXF8m	JY2UCNRGMZVW26SXMZFXGRBEIRICIVJ6F5KHAVBBIBADK53GEE7A	t	aaa	aaaa	f
\.


--
-- TOC entry 4892 (class 0 OID 49870)
-- Dependencies: 228
-- Data for Name: usuarios_externos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios_externos (id, nombre, rut, banco, tipo_cuenta, numero_cuenta, saldo) FROM stdin;
1	Juan Soto	23456789-0	BancoEstado	Cuenta Corriente	101010101	15000.00
2	Maria Paz	34567890-1	BCI	Cuenta Vista	202020202	50000.00
3	Pedro Rojas	45678901-2	Banco de Chile	Cuenta Corriente	303030303	12000.00
4	Carla Vera	56789012-3	Santander	Cuenta de Ahorro	404040404	250000.00
5	Felipe Lagos	67890123-4	Scotiabank	Cuenta Vista	505050505	8000.00
6	Andrea Muñoz	78901234-5	Banco Falabella	Cuenta Corriente	606060606	100000.00
9	Jorge	103534089	BancoEstado	Cuenta Corriente	2323	700.00
7	Jorge	21369340-9	BancoEstado	Cuenta Corriente	23233	1000.00
8	jorge	10353408-9	BancoEstado	Cuenta Corriente	2323	18000.00
\.


--
-- TOC entry 4910 (class 0 OID 0)
-- Dependencies: 220
-- Name: cuentas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuentas_id_seq', 14, true);


--
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 222
-- Name: destinatarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.destinatarios_id_seq', 1, false);


--
-- TOC entry 4912 (class 0 OID 0)
-- Dependencies: 224
-- Name: movimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimientos_id_seq', 1, false);


--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 231
-- Name: pagos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_id_seq', 1, false);


--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 226
-- Name: transferencias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transferencias_id_seq', 10, true);


--
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 229
-- Name: usuarios_externos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_externos_id_seq', 1, false);


--
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 230
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 12, true);


--
-- TOC entry 4710 (class 2606 OID 49883)
-- Name: cuentas PK_1176afa6e483a49bee4ad8d543e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT "PK_1176afa6e483a49bee4ad8d543e" PRIMARY KEY (id);


--
-- TOC entry 4724 (class 2606 OID 49885)
-- Name: usuarios_externos PK_3560c810a4c58466f4c7a327de7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_externos
    ADD CONSTRAINT "PK_3560c810a4c58466f4c7a327de7" PRIMARY KEY (id);


--
-- TOC entry 4728 (class 2606 OID 58338)
-- Name: pagos PK_37321ca70a2ed50885dc205beb2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "PK_37321ca70a2ed50885dc205beb2" PRIMARY KEY (id);


--
-- TOC entry 4716 (class 2606 OID 49887)
-- Name: movimientos PK_519702aa97def3e7c1b6cc5e2f9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT "PK_519702aa97def3e7c1b6cc5e2f9" PRIMARY KEY (id);


--
-- TOC entry 4718 (class 2606 OID 49889)
-- Name: transferencias PK_68d981495936b6bdcfe66cf9047; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT "PK_68d981495936b6bdcfe66cf9047" PRIMARY KEY (id);


--
-- TOC entry 4708 (class 2606 OID 49891)
-- Name: card PK_9451069b6f1199730791a7f4ae4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY (id);


--
-- TOC entry 4714 (class 2606 OID 49893)
-- Name: destinatarios PK_a1e5d383309545d198cd3acf43c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinatarios
    ADD CONSTRAINT "PK_a1e5d383309545d198cd3acf43c" PRIMARY KEY (id);


--
-- TOC entry 4720 (class 2606 OID 49895)
-- Name: usuarios PK_dfe59db369749f9042499fd8107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_dfe59db369749f9042499fd8107" PRIMARY KEY (id_usuario);


--
-- TOC entry 4712 (class 2606 OID 49897)
-- Name: cuentas UQ_41dcb0a39fab182940867a6e2bc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT "UQ_41dcb0a39fab182940867a6e2bc" UNIQUE (numero_cuenta);


--
-- TOC entry 4726 (class 2606 OID 49899)
-- Name: usuarios_externos UQ_5f109e5f88ad2c055326f7b20ea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios_externos
    ADD CONSTRAINT "UQ_5f109e5f88ad2c055326f7b20ea" UNIQUE (rut);


--
-- TOC entry 4722 (class 2606 OID 49901)
-- Name: usuarios UQ_e871b7157e4b74290df9baa9c93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_e871b7157e4b74290df9baa9c93" UNIQUE (correo_electronico);


--
-- TOC entry 4732 (class 2606 OID 49902)
-- Name: movimientos FK_0ca96c1a49110c0ea36585dd7e0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimientos
    ADD CONSTRAINT "FK_0ca96c1a49110c0ea36585dd7e0" FOREIGN KEY ("cuentaId") REFERENCES public.cuentas(id);


--
-- TOC entry 4733 (class 2606 OID 49907)
-- Name: transferencias FK_15638af0df4257e6238d86baf68; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT "FK_15638af0df4257e6238d86baf68" FOREIGN KEY (id_usuario_externo) REFERENCES public.usuarios_externos(id);


--
-- TOC entry 4730 (class 2606 OID 49912)
-- Name: cuentas FK_17f4fb7b576f6c740d28b884245; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT "FK_17f4fb7b576f6c740d28b884245" FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4731 (class 2606 OID 49917)
-- Name: destinatarios FK_4a8796ce6fee1f5e1a0cc9f8df1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinatarios
    ADD CONSTRAINT "FK_4a8796ce6fee1f5e1a0cc9f8df1" FOREIGN KEY (propietario_id) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4729 (class 2606 OID 49922)
-- Name: card FK_737d020f66e05a35b57376e85fc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card
    ADD CONSTRAINT "FK_737d020f66e05a35b57376e85fc" FOREIGN KEY (id_cuenta) REFERENCES public.cuentas(id) ON DELETE CASCADE;


--
-- TOC entry 4736 (class 2606 OID 58339)
-- Name: pagos FK_7c71a684ac01c476a6c2fa31863; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT "FK_7c71a684ac01c476a6c2fa31863" FOREIGN KEY (idusuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4734 (class 2606 OID 49927)
-- Name: transferencias FK_c2e7fdb0a2f41139136c6685943; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT "FK_c2e7fdb0a2f41139136c6685943" FOREIGN KEY (usuario_id_origen) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4735 (class 2606 OID 49932)
-- Name: transferencias FK_c6fb361b271501646fcc1b3506c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transferencias
    ADD CONSTRAINT "FK_c6fb361b271501646fcc1b3506c" FOREIGN KEY (id_usuario_destino) REFERENCES public.usuarios(id_usuario);


-- Completed on 2025-07-19 21:03:14

--
-- PostgreSQL database dump complete
--

