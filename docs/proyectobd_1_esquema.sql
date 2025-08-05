--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-05 15:37:39

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
-- TOC entry 945 (class 1247 OID 75896)
-- Name: enum_clients_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_clients_role AS ENUM (
    'client',
    'admin'
);


ALTER TYPE public.enum_clients_role OWNER TO postgres;

--
-- TOC entry 942 (class 1247 OID 75846)
-- Name: enum_clients_role_old; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_clients_role_old AS ENUM (
    'client',
    'admin'
);


ALTER TYPE public.enum_clients_role_old OWNER TO postgres;

--
-- TOC entry 939 (class 1247 OID 22901)
-- Name: old_enum_clients_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.old_enum_clients_role AS ENUM (
    'user',
    'client',
    'admin'
);


ALTER TYPE public.old_enum_clients_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 17583)
-- Name: Devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Devices" (
    id integer NOT NULL,
    imei character varying(255) NOT NULL,
    model character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Devices" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17582)
-- Name: Devices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Devices_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Devices_id_seq" OWNER TO postgres;

--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 223
-- Name: Devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Devices_id_seq" OWNED BY public."Devices".id;


--
-- TOC entry 226 (class 1259 OID 17595)
-- Name: Locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Locations" (
    id integer NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    "timestamp" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    device_id integer,
    CONSTRAINT lat_range CHECK (((lat >= ('-90'::integer)::double precision) AND (lat <= (90)::double precision))),
    CONSTRAINT lng_range CHECK (((lng >= ('-180'::integer)::double precision) AND (lng <= (180)::double precision)))
);


ALTER TABLE public."Locations" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17594)
-- Name: Locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Locations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Locations_id_seq" OWNER TO postgres;

--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 225
-- Name: Locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Locations_id_seq" OWNED BY public."Locations".id;


--
-- TOC entry 253 (class 1259 OID 75835)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 18614)
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    type_client_id integer NOT NULL,
    track_available boolean DEFAULT true,
    create_date timestamp with time zone NOT NULL,
    update_date timestamp with time zone,
    last_connection timestamp with time zone,
    contact character varying(255),
    address character varying(255),
    role public.enum_clients_role DEFAULT 'client'::public.enum_clients_role NOT NULL,
    premium_since timestamp without time zone,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18613)
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_id_seq OWNER TO postgres;

--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 235
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- TOC entry 238 (class 1259 OID 18631)
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devices (
    id integer NOT NULL,
    name text NOT NULL,
    imei text,
    create_date date NOT NULL,
    update_date date
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18630)
-- Name: devices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devices_id_seq OWNER TO postgres;

--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 237
-- Name: devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.devices_id_seq OWNED BY public.devices.id;


--
-- TOC entry 250 (class 1259 OID 75804)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    device_id integer,
    "timestamp" timestamp with time zone NOT NULL
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 75803)
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO postgres;

--
-- TOC entry 5269 (class 0 OID 0)
-- Dependencies: 249
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- TOC entry 252 (class 1259 OID 75823)
-- Name: order_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_details (
    id integer NOT NULL,
    order_id integer NOT NULL,
    service character varying(100) NOT NULL,
    cost numeric(10,2) NOT NULL,
    create_date timestamp without time zone DEFAULT now(),
    update_date timestamp without time zone
);


ALTER TABLE public.order_details OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 75822)
-- Name: order_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_details_id_seq OWNER TO postgres;

--
-- TOC entry 5270 (class 0 OID 0)
-- Dependencies: 251
-- Name: order_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_details_id_seq OWNED BY public.order_details.id;


--
-- TOC entry 248 (class 1259 OID 18703)
-- Name: order_tracker; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_tracker (
    id integer NOT NULL,
    client_id integer NOT NULL,
    vehicle_id integer,
    arrival_date date NOT NULL,
    departure_date date NOT NULL,
    create_date date NOT NULL,
    update_date date,
    description text,
    type_track_id integer,
    code_qr text,
    origin character varying(255) DEFAULT ''::character varying NOT NULL,
    destination character varying(255) DEFAULT ''::character varying NOT NULL,
    cost integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.order_tracker OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 18702)
-- Name: order_tracker_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_tracker_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_tracker_id_seq OWNER TO postgres;

--
-- TOC entry 5271 (class 0 OID 0)
-- Dependencies: 247
-- Name: order_tracker_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_tracker_id_seq OWNED BY public.order_tracker.id;


--
-- TOC entry 242 (class 1259 OID 18658)
-- Name: packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.packages (
    id integer NOT NULL,
    name text NOT NULL,
    quantity integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    create_date date NOT NULL,
    update_date date
);


ALTER TABLE public.packages OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 18657)
-- Name: packages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.packages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.packages_id_seq OWNER TO postgres;

--
-- TOC entry 5272 (class 0 OID 0)
-- Dependencies: 241
-- Name: packages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.packages_id_seq OWNED BY public.packages.id;


--
-- TOC entry 246 (class 1259 OID 18686)
-- Name: payment_package; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_package (
    id integer NOT NULL,
    pay_id integer NOT NULL,
    package_id integer NOT NULL,
    create_date date NOT NULL,
    update_date date
);


ALTER TABLE public.payment_package OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 18685)
-- Name: payment_package_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_package_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_package_id_seq OWNER TO postgres;

--
-- TOC entry 5273 (class 0 OID 0)
-- Dependencies: 245
-- Name: payment_package_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_package_id_seq OWNED BY public.payment_package.id;


--
-- TOC entry 244 (class 1259 OID 18667)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    client_id integer NOT NULL,
    type_pay_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    card character varying(255),
    paypal character varying(255),
    create_date date NOT NULL,
    update_date date,
    order_id integer
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 18666)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 5274 (class 0 OID 0)
-- Dependencies: 243
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 222 (class 1259 OID 17494)
-- Name: status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.status OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17493)
-- Name: status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.status_id_seq OWNER TO postgres;

--
-- TOC entry 5275 (class 0 OID 0)
-- Dependencies: 221
-- Name: status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.status_id_seq OWNED BY public.status.id;


--
-- TOC entry 218 (class 1259 OID 17172)
-- Name: statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statuses (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.statuses OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17171)
-- Name: statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.statuses_id_seq OWNER TO postgres;

--
-- TOC entry 5276 (class 0 OID 0)
-- Dependencies: 217
-- Name: statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statuses_id_seq OWNED BY public.statuses.id;


--
-- TOC entry 220 (class 1259 OID 17179)
-- Name: track_frame; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.track_frame (
    id integer NOT NULL,
    order_tracker_id integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    status_id integer,
    create_date timestamp with time zone NOT NULL,
    update_date timestamp with time zone
);


ALTER TABLE public.track_frame OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17178)
-- Name: track_frame_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.track_frame_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.track_frame_id_seq OWNER TO postgres;

--
-- TOC entry 5277 (class 0 OID 0)
-- Dependencies: 219
-- Name: track_frame_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.track_frame_id_seq OWNED BY public.track_frame.id;


--
-- TOC entry 228 (class 1259 OID 17607)
-- Name: trackers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trackers (
    id integer NOT NULL,
    identifier character varying(255) NOT NULL,
    "simNumber" character varying(255),
    "orderId" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.trackers OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17606)
-- Name: trackers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trackers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.trackers_id_seq OWNER TO postgres;

--
-- TOC entry 5278 (class 0 OID 0)
-- Dependencies: 227
-- Name: trackers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trackers_id_seq OWNED BY public.trackers.id;


--
-- TOC entry 230 (class 1259 OID 18587)
-- Name: type_client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_client (
    id integer NOT NULL,
    name text NOT NULL,
    create_date date NOT NULL,
    update_date date
);


ALTER TABLE public.type_client OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18586)
-- Name: type_client_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_client_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_client_id_seq OWNER TO postgres;

--
-- TOC entry 5279 (class 0 OID 0)
-- Dependencies: 229
-- Name: type_client_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_client_id_seq OWNED BY public.type_client.id;


--
-- TOC entry 232 (class 1259 OID 18596)
-- Name: type_pay; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_pay (
    id integer NOT NULL,
    name text NOT NULL,
    create_date date NOT NULL,
    update_date date
);


ALTER TABLE public.type_pay OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18595)
-- Name: type_pay_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_pay_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_pay_id_seq OWNER TO postgres;

--
-- TOC entry 5280 (class 0 OID 0)
-- Dependencies: 231
-- Name: type_pay_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_pay_id_seq OWNED BY public.type_pay.id;


--
-- TOC entry 234 (class 1259 OID 18605)
-- Name: type_track; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type_track (
    id integer NOT NULL,
    name text NOT NULL,
    create_date date NOT NULL,
    update_date date
);


ALTER TABLE public.type_track OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18604)
-- Name: type_track_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_track_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_track_id_seq OWNER TO postgres;

--
-- TOC entry 5281 (class 0 OID 0)
-- Dependencies: 233
-- Name: type_track_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_track_id_seq OWNED BY public.type_track.id;


--
-- TOC entry 240 (class 1259 OID 18642)
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    plate character varying(255) NOT NULL,
    brand character varying(255) NOT NULL,
    model character varying(255),
    client_id integer
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18641)
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_id_seq OWNER TO postgres;

--
-- TOC entry 5282 (class 0 OID 0)
-- Dependencies: 239
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- TOC entry 4796 (class 2604 OID 17586)
-- Name: Devices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices" ALTER COLUMN id SET DEFAULT nextval('public."Devices_id_seq"'::regclass);


--
-- TOC entry 4798 (class 2604 OID 17598)
-- Name: Locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Locations" ALTER COLUMN id SET DEFAULT nextval('public."Locations_id_seq"'::regclass);


--
-- TOC entry 4803 (class 2604 OID 18617)
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- TOC entry 4807 (class 2604 OID 18634)
-- Name: devices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices ALTER COLUMN id SET DEFAULT nextval('public.devices_id_seq'::regclass);


--
-- TOC entry 4816 (class 2604 OID 75807)
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 75826)
-- Name: order_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public.order_details_id_seq'::regclass);


--
-- TOC entry 4812 (class 2604 OID 18706)
-- Name: order_tracker id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracker ALTER COLUMN id SET DEFAULT nextval('public.order_tracker_id_seq'::regclass);


--
-- TOC entry 4809 (class 2604 OID 18661)
-- Name: packages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages ALTER COLUMN id SET DEFAULT nextval('public.packages_id_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 18689)
-- Name: payment_package id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_package ALTER COLUMN id SET DEFAULT nextval('public.payment_package_id_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 18670)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 17497)
-- Name: status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status ALTER COLUMN id SET DEFAULT nextval('public.status_id_seq'::regclass);


--
-- TOC entry 4793 (class 2604 OID 17175)
-- Name: statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses ALTER COLUMN id SET DEFAULT nextval('public.statuses_id_seq'::regclass);


--
-- TOC entry 4794 (class 2604 OID 17182)
-- Name: track_frame id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track_frame ALTER COLUMN id SET DEFAULT nextval('public.track_frame_id_seq'::regclass);


--
-- TOC entry 4799 (class 2604 OID 17610)
-- Name: trackers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trackers ALTER COLUMN id SET DEFAULT nextval('public.trackers_id_seq'::regclass);


--
-- TOC entry 4800 (class 2604 OID 18590)
-- Name: type_client id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_client ALTER COLUMN id SET DEFAULT nextval('public.type_client_id_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 18599)
-- Name: type_pay id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_pay ALTER COLUMN id SET DEFAULT nextval('public.type_pay_id_seq'::regclass);


--
-- TOC entry 4802 (class 2604 OID 18608)
-- Name: type_track id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_track ALTER COLUMN id SET DEFAULT nextval('public.type_track_id_seq'::regclass);


--
-- TOC entry 4808 (class 2604 OID 18645)
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- TOC entry 5230 (class 0 OID 17583)
-- Dependencies: 224
-- Data for Name: Devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Devices" (id, imei, model, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5232 (class 0 OID 17595)
-- Dependencies: 226
-- Data for Name: Locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Locations" (id, lat, lng, "timestamp", "createdAt", "updatedAt", device_id) FROM stdin;
\.


--
-- TOC entry 5259 (class 0 OID 75835)
-- Dependencies: 253
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250729205847-add-origin-destination-cost-to-order-tracker.js
\.


--
-- TOC entry 5242 (class 0 OID 18614)
-- Dependencies: 236
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, name, email, password, type_client_id, track_available, create_date, update_date, last_connection, contact, address, role, premium_since, is_active) FROM stdin;
5	Fabian	fabian@gmail.com	$2b$10$CH84cpk/KIHv3QUILx27ku/dW9IcqPXc/LQ.87kEejxc8lof.AAOO	2	t	2025-07-30 23:08:28.543-06	2025-07-30 23:33:09.448-06	2025-07-30 23:19:57.584-06	89946259	Upala	client	2025-07-31 05:17:16.651	t
18	Juan2	juan2@gmail.com	$2b$10$7a5hzwAd8ZRsVFY/.iFuKOM6GsKmMKuxw9aEbnDpBFTZCJS1LjsLm	2	t	2025-08-05 02:44:10.599-06	2025-08-05 02:44:58.673-06	2025-08-05 02:44:50.771-06			client	2025-08-05 08:44:33.809	t
4	Jairo	jairo1@gmail.com	$2b$10$pMgE3OHf2/8u2UeLS0PnNOUw9OjR8hKIJgjw7mWaGsaZE79UlooHK	2	t	2025-07-25 18:20:30.845-06	2025-08-04 19:22:36.501-06	2025-08-05 02:51:56.829-06	85211316	Quesada	client	\N	t
15	Admin Principal	admin@gmail.com	$2b$10$cU.u977YoV0kxlawka1og.m5PYamo1x9s5RpChDd7N3N6diDoqykC	2	t	2025-08-03 23:55:16.832672-06	\N	2025-08-05 02:56:32.065-06	\N	\N	admin	\N	t
16	Prueba2	pruena2@gmail.com	$2b$10$3M291Og0oay5mOFmrAeYNuM3kwK5B4FWC24etTJsX.VVyWfsIPrG2	1	t	2025-08-04 01:39:45.301-06	\N	\N	\N	\N	client	\N	t
1	Jairo	jairo@gmail.com	1234	2	t	2025-07-24 18:00:00-06	\N	\N	85211316	Quesada	client	\N	f
17	Juan	juan@gmail.com	$2b$10$JOVPZJWksV5LK6f3B32mBO8w1nGxG.xaaZwTXQhYI1YxxIrePz9VC	2	t	2025-08-04 20:49:12.365-06	2025-08-05 00:27:37.359-06	2025-08-05 02:43:32.561-06			client	\N	t
\.


--
-- TOC entry 5244 (class 0 OID 18631)
-- Dependencies: 238
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devices (id, name, imei, create_date, update_date) FROM stdin;
1	Device A	123456789012345	2025-07-25	\N
2	Device B	987654321098765	2025-07-25	\N
\.


--
-- TOC entry 5256 (class 0 OID 75804)
-- Dependencies: 250
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, lat, lng, device_id, "timestamp") FROM stdin;
\.


--
-- TOC entry 5258 (class 0 OID 75823)
-- Dependencies: 252
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_details (id, order_id, service, cost, create_date, update_date) FROM stdin;
\.


--
-- TOC entry 5254 (class 0 OID 18703)
-- Dependencies: 248
-- Data for Name: order_tracker; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_tracker (id, client_id, vehicle_id, arrival_date, departure_date, create_date, update_date, description, type_track_id, code_qr, origin, destination, cost) FROM stdin;
14	4	2	2025-07-30	2025-08-03	2025-07-31	\N	Laptops UTN	\N	\N	Quesada, Costa Rica	San Jose, Costa Rica	25
17	4	2	2025-08-22	2025-09-04	2025-08-02	\N	Verduras	\N	\N	La Fortuna	Coto Brus	25
13	4	2	2025-07-31	2025-08-09	2025-07-31	2025-08-04	Fresco	\N		Upala, Costa Rica	Liberia, Costa Rica	25
22	4	1	2025-08-04	2025-08-06	2025-08-04	\N	Comida	\N	\N	Upala, Costa Rica	Heredia, Costa Rica	25
19	4	2	2025-08-15	2025-08-28	2025-08-02	2025-08-04	Juegos	\N	\N	Cañas, Costa Rica	Upala, Costa Rica	25
23	4	3	2025-08-15	2025-08-19	2025-08-04	\N	Atunes	\N	\N	Agua Zarcas, Costa Rica	Limon, Costa Rica	25
24	17	3	2025-08-02	2025-08-06	2025-08-05	\N	Pescados	\N	\N	Ciudad Quesada	Puntarenas	25
25	17	1	2025-08-01	2025-08-06	2025-08-05	\N	PC	\N	\N	Ciudad Quesada	San Jose, Costa Rica	25
26	17	1	2025-08-01	2025-08-06	2025-08-05	\N	PC	\N	\N	Ciudad Quesada	San Jose, Costa Rica	25
27	17	3	2025-08-22	2025-08-28	2025-08-05	\N	PC	\N	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAADkCAYAAACIV4iNAAAAAklEQVR4AewaftIAAAw8SURBVO3BQY4YybLgQDJR978yR0tfBZDIkjreHzezP1hrXeFhrXWNh7XWNR7WWtd4WGtd42GtdY2HtdY1HtZa13hYa13jYa11jYe11jUe1lrXeFhrXeNhrXWNh7XWNR7WWtf44SOVf6niROWk4kTlpOJE5aRiUpkq3lCZKn6TylQxqZxUnKicVJyoTBWTyr9U8cXDWusaD2utazysta7xwy+r+E0qb1RMKicqb6icVJyoTBWTyhcqU8WkMlVMKlPFScWkMqmcVJyo/KaK36Tymx7WWtd4WGtd42GtdY0f/jKVNyreUJkq3qg4UTmpmFROKt6omFS+qJhUTlTeqJhUvqiYVH6TyhsVf9PDWusaD2utazysta7xw/8xKlPFpDJVnFScqLyhMlVMFScVk8oXFZPKScWJyknFpHJScVLxf8nDWusaD2utazysta7xw/9nKk5UTiqmiknlpOJE5TepTBW/SeWk4qRiUjmp+L/sYa11jYe11jUe1lrX+OEvq/gvqUwVb1S8UTGpTCpTxRsVb6i8UfFGxaQyqUwVk8pUMalMFb+p4iYPa61rPKy1rvGw1rrGD79M5b9UMamcqEwVk8pUMalMFScVk8pUMamcqEwVb6hMFZPKVDGpTBWTyt+kMlWcqNzsYa11jYe11jUe1lrX+OGjipuonKhMFZPKVDGpTBVfVHxR8YbK36QyVZxUnFRMKlPFScX/koe11jUe1lrXeFhrXcP+4AOVqWJS+U0VX6j8TRUnKjepOFGZKk5UpooTlaliUpkqJpWpYlL5TRV/08Na6xoPa61rPKy1rvHDL1P5ouI3qUwVX6i8oXJS8YbKGxVvqHxR8UbFScWkMlW8UXGicqIyVfymh7XWNR7WWtd4WGtdw/7gP6TyRcWkMlVMKjep+EJlqphUTipOVL6omFSmiknljYpJZar4TSonFV88rLWu8bDWusbDWusa9gcfqJxU/E0qU8Wk8kbFpHJSMalMFb9JZar4QmWqmFTeqPibVKaKL1SmihOVqeI3Pay1rvGw1rrGw1rrGvYHf5HKb6o4UTmp+ELljYovVN6o+JtUpoo3VE4qJpU3Kk5UpooTlaliUpkqvnhYa13jYa11jYe11jV++McqJpWTiknlpGJSeUNlqjipOFF5o+KkYlKZVKaKL1TeUJkqvqiYVKaKE5UTlZOKk4rf9LDWusbDWusaD2uta9gf/EMqU8WkclJxovJGxYnKFxUnKn9TxaQyVXyh8kbFicpJxYnKVDGpfFExqUwVXzysta7xsNa6xsNa6xo//GMVJxUnKicVb6j8popJ5Y2KSWWq+F9S8UbFpPKFyhcVk8pU8Zse1lrXeFhrXeNhrXUN+4MPVN6omFSmikllqphUpooTlaliUnmjYlKZKk5UTiomlZOKN1Smii9UTiomlaniROWkYlI5qThRmSr+poe11jUe1lrXeFhrXeOHjyomlanii4pJZaqYVN5QmSomlROVE5WTiknljYpJZaqYVN5QmSpOKt6o+KJiUvlCZar4lx7WWtd4WGtd42GtdQ37g/+QyhcVb6hMFf/LVKaKSWWqmFROKiaVqWJSOamYVKaKSeWNii9UTiomlanii4e11jUe1lrXeFhrXcP+4B9SmSreUHmjYlI5qXhDZao4UZkqJpWp4g2Vm1RMKlPFpHJSMan8pooTlZOKLx7WWtd4WGtd42GtdQ37gw9Upoo3VL6omFSmijdUpopJ5aRiUvmXKiaVqeINlaniROWkYlL5TRWTylRxovJFxRcPa61rPKy1rvGw1rrGD79M5Y2KSWWqOFGZKk5UTipOKk5UpopJZaqYVKaKSeVE5URlqphUTlSmipOKLyomlaliUnlDZar4Lz2sta7xsNa6xsNa6xr2Bx+oTBWTylQxqfxNFW+ovFExqUwVk8pUcaLymyq+UDmpmFSmiknlZhWTyknFFw9rrWs8rLWu8bDWuob9wT+kclLxhspJxYnKScWkMlVMKlPFGyonFW+ovFExqUwVk8obFW+ovFHxhspU8V96WGtd42GtdY2HtdY1fricylTxhspJxYnKVHFSMalMFZPKFypTxUnFicpUcVIxqZyonFScVEwqJypTxYnKScWkMlV88bDWusbDWusaD2uta/zwl6l8UfFGxYnKpDJVTBWTyknFVDGpTBWTyhsVb6hMFScqJxVTxYnKGxVfVLxRcaIyVfymh7XWNR7WWtd4WGtdw/7gA5WTiknlb6o4UZkqTlSmihOVqeJEZaqYVH5TxRcqU8WkclIxqUwVk8pUMancpOKLh7XWNR7WWtd4WGtd44fLVJyofFExqZxUTConFZPKVDFVTCpTxYnKVPGbVKaKSWWqmFROKr6o+JdU/qaHtdY1HtZa13hYa13D/uADlaliUnmjYlKZKiaVk4pJZaqYVE4qTlSmikllqvhC5aTiN6lMFW+onFRMKm9UTCr/UsUXD2utazysta7xsNa6hv3BL1I5qThRmSpOVN6omFROKr5QmSpOVKaKSWWqmFSmikllqjhR+aJiUpkq3lA5qfhC5Y2K3/Sw1rrGw1rrGg9rrWv88JHKVPFFxaQyVZxU/CaVqWJSmSqmikllqpgqJpWp4l+q+ELlRGWqmFSmijdUpopJ5QuVqeKLh7XWNR7WWtd4WGtd44ePKiaVk4o3KiaVL1ROKk5Uvqg4UZkqJpWp4kTlC5UvKt5QeUPlpOKkYlKZKk5UftPDWusaD2utazysta7xw0cqU8UXKm9UnKj8l1SmiknlN1WcqLxRMalMFScqU8WkclIxqUwVJyonFScqJxW/6WGtdY2HtdY1HtZa1/jhH1OZKqaKE5VJ5aRiUjlRmSp+k8pUMalMKicqU8WkMlW8oXKiMlVMFW9UvKEyVUwVk8oXFX/Tw1rrGg9rrWs8rLWuYX/wgcpUMalMFZPKVDGpnFRMKr+p4g2VqWJSeaPiDZWp4kTlpOINlZOKE5U3Kk5UpoovVE4qvnhYa13jYa11jYe11jXsD/4hlaniC5U3Kr5QeaNiUvmiYlKZKiaVNyomlaliUvmi4guVk4pJ5aTiDZWp4ouHtdY1HtZa13hYa13D/uADlZOKL1R+U8WJyhsVJypTxaQyVfyXVE4qTlROKiaVqWJSeaPiDZXfVPHFw1rrGg9rrWs8rLWu8cPlKiaVqWJSeUPlpGJSmVSmiqliUpkqJpWpYlJ5o2JS+ZcqTiomlaniRGVSeaNiUnmj4jc9rLWu8bDWusbDWusa9ge/SGWqeEPli4oTlaliUnmj4guVqeJE5Y2KSWWq+ELljYpJZaqYVKaKE5WTikllqjhROan44mGtdY2HtdY1HtZa17A/+EUqb1S8oTJVTConFV+ofFHxN6mcVEwqJxUnKlPFpDJV/JdUTir+Sw9rrWs8rLWu8bDWuob9wQcqb1S8ofI3VZyoTBWTyknFicpUMan8pooTlaliUpkqTlTeqJhUblIxqUwVXzysta7xsNa6xsNa6xr2B//DVH5TxRcqJxUnKicVb6hMFZPKb6o4UZkqJpWp4kRlqnhD5aTiX3pYa13jYa11jYe11jV++EjlX6qYKiaVqeJE5TdVTCp/k8pUcaIyVUwqU8UXKlPFpPI3qUwVJxUnKicVXzysta7xsNa6xsNa6xo//LKK36RyojJVTCpTxRcqU8UbKr+p4guV36QyVZxU/E0Vv6liUvlND2utazysta7xsNa6xg9/mcobFV+oTBVvqEwVJypTxUnFicqJym+qOFE5qXhD5aRiUnlD5QuV/9LDWusaD2utazysta7xw/8xFScqb6hMFZPKpHKi8kXFFypfVEwqf1PFpHJSMalMFZPKScWJym96WGtd42GtdY2HtdY1flhHFb+pYlKZKk5U3qiYKt6oOKk4UZkqTlTeqJhU3qiYVCaVqWKq+E0Pa61rPKy1rvGw1rrGD39Zxd9UcaJyUjGpTCpfVEwqv6niC5XfVHGiMlVMFTepOFGZKr54WGtd42GtdY2HtdY1fvhlKv+SyknFicpU8YbKVPFGxRsVk8pJxUnFpPJGxRsVk8pUMalMFW9UTCpTxVQxqfxLD2utazysta7xsNa6hv3BWusKD2utazysta7xsNa6xsNa6xoPa61rPKy1rvGw1rrGw1rrGg9rrWs8rLWu8bDWusbDWusaD2utazysta7xsNa6xv8DOD/kmvOLHTcAAAAASUVORK5CYII=	Ciudad Quesada	San Jose, Costa Rica	25
29	4	3	2025-08-14	2025-08-07	2025-08-05	\N	Prueba2	\N	data:image/png;base64,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U8WJylRxovKJijdUpoqTiknlpOJmD2utazysta7xsNa6xg8fUpkqJpUTlaliUpkq3qj4m1SmikllqjhRmSo+UXGi8kbFpDKpfJPKVDFVTConKp+o+KaHtdY1HtZa13hYa13D/uADKr+p4g2VqeKbVKaKSWWqeENlqphUpopJ5Y2KE5WTikllqphUpor/JSpTxTc9rLWu8bDWusbDWusaP3xZxTepTBWTylRxojJVTConFZPKGypTxVQxqUwVb1RMKicqU8WkclIxqZyoTBWTyknFicpUMalMFW+oTBWfeFhrXeNhrXWNh7XWNewPPqAyVUwqU8WkMlWcqHyi4hMqJxWfUHmjYlI5qZhUpopJZaqYVKaKSeWk4hMqJxUnKicVf9PDWusaD2utazysta5hf/AXqUwVk8pJxYnKVDGpTBUnKlPFN6mcVHyTylTxhspUMalMFScqU8WJylRxojJVTCqfqPimh7XWNR7WWtd4WGtd44dfpjJVTConFZPKScUnVKaKSWWqmFSmikllqphUJpVPVJyoTBWTyonKGyrfpDJVTBWTylQxqZxU/KaHtdY1HtZa13hYa13jhw+p/CaVk4pJZap4o2JSmSo+UTGpnFScqEwVb1RMKlPFGyqTyknFpPJNKlPFpDJVnKicVHziYa11jYe11jUe1lrXsD/4gMpvqvibVD5R8U0qU8WkMlVMKm9UTCrfVPFNKicVk8pU8QmVqeITD2utazysta7xsNa6xg8fqphUTireUJkqJpWpYlKZKk4qPqEyVZyonFRMKicqU8WkMlVMKicVJypvqEwVk8pvUrnJw1rrGg9rrWs8rLWu8cM/pnJSMam8UTGpnFRMKm9UTCpTxVQxqUwqv0llqphUJpWp4qTipGJSmSomlaniExU3eVhrXeNhrXWNh7XWNX74ZRUnFZPKpPKGylRxUvFGxYnKGypTxaQyVUwqn6g4qZhUJpUTlanipGJSeUPlDZWp4kTlpOITD2utazysta7xsNa6hv3BF6m8UfEvqZxUnKicVLyhMlWcqHxTxaTyiYpJZaqYVE4q/sse1lrXeFhrXeNhrXWNHz6k8kbFGypTxaQyVbxRMal8ouINlROVb6r4popJZVKZKiaVqWJSmVR+U8WkMlVMKlPFJx7WWtd4WGtd42GtdQ37g/9hKicVJypTxaTymyomlZOKN1SmiknlExX/kspU8YbKGxW/6WGtdY2HtdY1HtZa1/jhQyp/U8VUMan8popJ5RMqU8WkcqIyVZyoTBUnKm+onFRMKlPFpPIJlanipOINlaniEw9rrWs8rLWu8bDWuob9wQdUpopvUpkqJpVPVNxE5aTiDZXfVPE3qZxUvKEyVfxLD2utazysta7xsNa6xg+/TOWNik9UTCq/SeWNik+ofFPFico3qZxUTCpTxaQyqXyTylQxqUwVn3hYa13jYa11jYe11jV++I+rmFQ+oTJVvKHyiYpPqHyiYlI5qfhExScqTlQmlanib3pYa13jYa11jYe11jV++H+mYlKZKj6hclIxqUwVJypvVEwVk8pUMVWcVEwqk8pUcaLyRsWk8kbFpDKpTBVTxTc9rLWu8bDWusbDWusaP/yyit9UMalMFZPKVPEJlaniROUTFZPKVPE3qZxUvFExqXxCZap4o+JEZar4xMNa6xoPa61rPKy1rvHDl6n8TSpvVEwqb1ScqPwmlROVqWJSmSreUJkqJpVJZaqYVKaKqWJSOak4UZkqpopJ5W96WGtd42GtdY2HtdY17A/WWld4WGtd42GtdY2HtdY1HtZa13hYa13jYa11jYe11jUe1lrXeFhrXeNhrXWNh7XWNR7WWtd4WGtd42GtdY2HtdY1/g8/+Mzo+iN2RQAAAABJRU5ErkJggg==	Upala, Costa Rica	Liberia, Costa Rica	25
\.


--
-- TOC entry 5248 (class 0 OID 18658)
-- Dependencies: 242
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.packages (id, name, quantity, amount, create_date, update_date) FROM stdin;
1	Basic	1	9.99	2025-07-25	\N
2	Pro	5	49.99	2025-07-25	\N
\.


--
-- TOC entry 5252 (class 0 OID 18686)
-- Dependencies: 246
-- Data for Name: payment_package; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_package (id, pay_id, package_id, create_date, update_date) FROM stdin;
1	1	1	2025-07-25	\N
\.


--
-- TOC entry 5250 (class 0 OID 18667)
-- Dependencies: 244
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, client_id, type_pay_id, amount, card, paypal, create_date, update_date, order_id) FROM stdin;
1	1	1	9.99	**** **** **** 1111	\N	2025-07-25	\N	\N
6	4	1	25.00	5980	\N	2025-07-30	2025-07-30	13
7	4	1	25.00	6980	\N	2025-07-30	2025-07-30	14
8	5	3	10000.00	\N	\N	2025-07-30	\N	\N
10	4	1	25.00	undefined - undefined - undefined	\N	2025-08-05	2025-08-05	19
11	4	1	25.00	undefined - undefined - undefined	\N	2025-08-05	2025-08-05	17
12	4	1	25.00	undefined - undefined - undefined	\N	2025-08-05	2025-08-05	23
13	17	1	25.00	undefined - undefined - undefined	\N	2025-08-05	2025-08-05	24
14	17	1	25.00	undefined - undefined - undefined	\N	2025-08-05	2025-08-05	27
15	18	1	10000.00	Jairo - ****3456	\N	2025-08-05	\N	\N
17	4	1	25.00	undefined - undefined - undefined	\N	2025-08-05	2025-08-05	29
\.


--
-- TOC entry 5228 (class 0 OID 17494)
-- Dependencies: 222
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status (id, name) FROM stdin;
\.


--
-- TOC entry 5224 (class 0 OID 17172)
-- Dependencies: 218
-- Data for Name: statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statuses (id, name) FROM stdin;
\.


--
-- TOC entry 5226 (class 0 OID 17179)
-- Dependencies: 220
-- Data for Name: track_frame; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.track_frame (id, order_tracker_id, latitude, longitude, status_id, create_date, update_date) FROM stdin;
\.


--
-- TOC entry 5234 (class 0 OID 17607)
-- Dependencies: 228
-- Data for Name: trackers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trackers (id, identifier, "simNumber", "orderId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5236 (class 0 OID 18587)
-- Dependencies: 230
-- Data for Name: type_client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_client (id, name, create_date, update_date) FROM stdin;
1	Free	2025-07-25	\N
2	Premium	2025-07-25	\N
\.


--
-- TOC entry 5238 (class 0 OID 18596)
-- Dependencies: 232
-- Data for Name: type_pay; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_pay (id, name, create_date, update_date) FROM stdin;
1	Tarjeta	2025-07-25	\N
2	PayPal	2025-07-25	\N
3	Upgrade Premium	2025-07-30	\N
\.


--
-- TOC entry 5240 (class 0 OID 18605)
-- Dependencies: 234
-- Data for Name: type_track; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type_track (id, name, create_date, update_date) FROM stdin;
1	GPS	2025-07-25	\N
2	Bluetooth	2025-07-25	\N
\.


--
-- TOC entry 5246 (class 0 OID 18642)
-- Dependencies: 240
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (id, plate, brand, model, client_id) FROM stdin;
1	ABC-1234	Toyota	Corolla	1
3	SHL-354	Postal	2015	\N
2	XYZ-5678	Ford	Fiesta	\N
\.


--
-- TOC entry 5283 (class 0 OID 0)
-- Dependencies: 223
-- Name: Devices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Devices_id_seq"', 1, false);


--
-- TOC entry 5284 (class 0 OID 0)
-- Dependencies: 225
-- Name: Locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Locations_id_seq"', 1, false);


--
-- TOC entry 5285 (class 0 OID 0)
-- Dependencies: 235
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 18, true);


--
-- TOC entry 5286 (class 0 OID 0)
-- Dependencies: 237
-- Name: devices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.devices_id_seq', 3, true);


--
-- TOC entry 5287 (class 0 OID 0)
-- Dependencies: 249
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 1, false);


--
-- TOC entry 5288 (class 0 OID 0)
-- Dependencies: 251
-- Name: order_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_details_id_seq', 1, false);


--
-- TOC entry 5289 (class 0 OID 0)
-- Dependencies: 247
-- Name: order_tracker_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_tracker_id_seq', 29, true);


--
-- TOC entry 5290 (class 0 OID 0)
-- Dependencies: 241
-- Name: packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.packages_id_seq', 2, true);


--
-- TOC entry 5291 (class 0 OID 0)
-- Dependencies: 245
-- Name: payment_package_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_package_id_seq', 1, true);


--
-- TOC entry 5292 (class 0 OID 0)
-- Dependencies: 243
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 17, true);


--
-- TOC entry 5293 (class 0 OID 0)
-- Dependencies: 221
-- Name: status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.status_id_seq', 1, false);


--
-- TOC entry 5294 (class 0 OID 0)
-- Dependencies: 217
-- Name: statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statuses_id_seq', 1, false);


--
-- TOC entry 5295 (class 0 OID 0)
-- Dependencies: 219
-- Name: track_frame_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.track_frame_id_seq', 5, true);


--
-- TOC entry 5296 (class 0 OID 0)
-- Dependencies: 227
-- Name: trackers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.trackers_id_seq', 1, false);


--
-- TOC entry 5297 (class 0 OID 0)
-- Dependencies: 229
-- Name: type_client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_client_id_seq', 2, true);


--
-- TOC entry 5298 (class 0 OID 0)
-- Dependencies: 231
-- Name: type_pay_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_pay_id_seq', 3, true);


--
-- TOC entry 5299 (class 0 OID 0)
-- Dependencies: 233
-- Name: type_track_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_track_id_seq', 2, true);


--
-- TOC entry 5300 (class 0 OID 0)
-- Dependencies: 239
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicles_id_seq', 3, true);


--
-- TOC entry 4831 (class 2606 OID 19728)
-- Name: Devices Devices_imei_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key" UNIQUE (imei);


--
-- TOC entry 4833 (class 2606 OID 19726)
-- Name: Devices Devices_imei_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key1" UNIQUE (imei);


--
-- TOC entry 4835 (class 2606 OID 19740)
-- Name: Devices Devices_imei_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key10" UNIQUE (imei);


--
-- TOC entry 4837 (class 2606 OID 19718)
-- Name: Devices Devices_imei_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key11" UNIQUE (imei);


--
-- TOC entry 4839 (class 2606 OID 19742)
-- Name: Devices Devices_imei_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key12" UNIQUE (imei);


--
-- TOC entry 4841 (class 2606 OID 19716)
-- Name: Devices Devices_imei_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key13" UNIQUE (imei);


--
-- TOC entry 4843 (class 2606 OID 19714)
-- Name: Devices Devices_imei_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key14" UNIQUE (imei);


--
-- TOC entry 4845 (class 2606 OID 19744)
-- Name: Devices Devices_imei_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key15" UNIQUE (imei);


--
-- TOC entry 4847 (class 2606 OID 19746)
-- Name: Devices Devices_imei_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key16" UNIQUE (imei);


--
-- TOC entry 4849 (class 2606 OID 19730)
-- Name: Devices Devices_imei_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key2" UNIQUE (imei);


--
-- TOC entry 4851 (class 2606 OID 19732)
-- Name: Devices Devices_imei_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key3" UNIQUE (imei);


--
-- TOC entry 4853 (class 2606 OID 19724)
-- Name: Devices Devices_imei_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key4" UNIQUE (imei);


--
-- TOC entry 4855 (class 2606 OID 19734)
-- Name: Devices Devices_imei_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key5" UNIQUE (imei);


--
-- TOC entry 4857 (class 2606 OID 19722)
-- Name: Devices Devices_imei_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key6" UNIQUE (imei);


--
-- TOC entry 4859 (class 2606 OID 19736)
-- Name: Devices Devices_imei_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key7" UNIQUE (imei);


--
-- TOC entry 4861 (class 2606 OID 19720)
-- Name: Devices Devices_imei_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key8" UNIQUE (imei);


--
-- TOC entry 4863 (class 2606 OID 19738)
-- Name: Devices Devices_imei_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_imei_key9" UNIQUE (imei);


--
-- TOC entry 4865 (class 2606 OID 17591)
-- Name: Devices Devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Devices"
    ADD CONSTRAINT "Devices_pkey" PRIMARY KEY (id);


--
-- TOC entry 4867 (class 2606 OID 17600)
-- Name: Locations Locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_pkey" PRIMARY KEY (id);


--
-- TOC entry 5063 (class 2606 OID 75839)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 4878 (class 2606 OID 22856)
-- Name: clients clients_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key UNIQUE (email);


--
-- TOC entry 4880 (class 2606 OID 22858)
-- Name: clients clients_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key1 UNIQUE (email);


--
-- TOC entry 4882 (class 2606 OID 22868)
-- Name: clients clients_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key10 UNIQUE (email);


--
-- TOC entry 4884 (class 2606 OID 22846)
-- Name: clients clients_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key11 UNIQUE (email);


--
-- TOC entry 4886 (class 2606 OID 22870)
-- Name: clients clients_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key12 UNIQUE (email);


--
-- TOC entry 4888 (class 2606 OID 22872)
-- Name: clients clients_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key13 UNIQUE (email);


--
-- TOC entry 4890 (class 2606 OID 22874)
-- Name: clients clients_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key14 UNIQUE (email);


--
-- TOC entry 4892 (class 2606 OID 22844)
-- Name: clients clients_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key15 UNIQUE (email);


--
-- TOC entry 4894 (class 2606 OID 22842)
-- Name: clients clients_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key16 UNIQUE (email);


--
-- TOC entry 4896 (class 2606 OID 22876)
-- Name: clients clients_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key17 UNIQUE (email);


--
-- TOC entry 4898 (class 2606 OID 22878)
-- Name: clients clients_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key18 UNIQUE (email);


--
-- TOC entry 4900 (class 2606 OID 22880)
-- Name: clients clients_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key19 UNIQUE (email);


--
-- TOC entry 4902 (class 2606 OID 22860)
-- Name: clients clients_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key2 UNIQUE (email);


--
-- TOC entry 4904 (class 2606 OID 22840)
-- Name: clients clients_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key20 UNIQUE (email);


--
-- TOC entry 4906 (class 2606 OID 22838)
-- Name: clients clients_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key21 UNIQUE (email);


--
-- TOC entry 4908 (class 2606 OID 22882)
-- Name: clients clients_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key22 UNIQUE (email);


--
-- TOC entry 4910 (class 2606 OID 22884)
-- Name: clients clients_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key23 UNIQUE (email);


--
-- TOC entry 4912 (class 2606 OID 22836)
-- Name: clients clients_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key24 UNIQUE (email);


--
-- TOC entry 4914 (class 2606 OID 22886)
-- Name: clients clients_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key25 UNIQUE (email);


--
-- TOC entry 4916 (class 2606 OID 22888)
-- Name: clients clients_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key26 UNIQUE (email);


--
-- TOC entry 4918 (class 2606 OID 22834)
-- Name: clients clients_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key27 UNIQUE (email);


--
-- TOC entry 4920 (class 2606 OID 22890)
-- Name: clients clients_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key28 UNIQUE (email);


--
-- TOC entry 4922 (class 2606 OID 22892)
-- Name: clients clients_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key29 UNIQUE (email);


--
-- TOC entry 4924 (class 2606 OID 22854)
-- Name: clients clients_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key3 UNIQUE (email);


--
-- TOC entry 4926 (class 2606 OID 22894)
-- Name: clients clients_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key30 UNIQUE (email);


--
-- TOC entry 4928 (class 2606 OID 22896)
-- Name: clients clients_email_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key31 UNIQUE (email);


--
-- TOC entry 4930 (class 2606 OID 22898)
-- Name: clients clients_email_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key32 UNIQUE (email);


--
-- TOC entry 4932 (class 2606 OID 22832)
-- Name: clients clients_email_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key33 UNIQUE (email);


--
-- TOC entry 4934 (class 2606 OID 22862)
-- Name: clients clients_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key4 UNIQUE (email);


--
-- TOC entry 4936 (class 2606 OID 22852)
-- Name: clients clients_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key5 UNIQUE (email);


--
-- TOC entry 4938 (class 2606 OID 22864)
-- Name: clients clients_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key6 UNIQUE (email);


--
-- TOC entry 4940 (class 2606 OID 22866)
-- Name: clients clients_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key7 UNIQUE (email);


--
-- TOC entry 4942 (class 2606 OID 22850)
-- Name: clients clients_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key8 UNIQUE (email);


--
-- TOC entry 4944 (class 2606 OID 22848)
-- Name: clients clients_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key9 UNIQUE (email);


--
-- TOC entry 4946 (class 2606 OID 18622)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4949 (class 2606 OID 22536)
-- Name: devices devices_imei_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key UNIQUE (imei);


--
-- TOC entry 4951 (class 2606 OID 22534)
-- Name: devices devices_imei_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key1 UNIQUE (imei);


--
-- TOC entry 4953 (class 2606 OID 22528)
-- Name: devices devices_imei_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key10 UNIQUE (imei);


--
-- TOC entry 4955 (class 2606 OID 22522)
-- Name: devices devices_imei_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key11 UNIQUE (imei);


--
-- TOC entry 4957 (class 2606 OID 22546)
-- Name: devices devices_imei_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key12 UNIQUE (imei);


--
-- TOC entry 4959 (class 2606 OID 22548)
-- Name: devices devices_imei_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key13 UNIQUE (imei);


--
-- TOC entry 4961 (class 2606 OID 22520)
-- Name: devices devices_imei_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key14 UNIQUE (imei);


--
-- TOC entry 4963 (class 2606 OID 22550)
-- Name: devices devices_imei_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key15 UNIQUE (imei);


--
-- TOC entry 4965 (class 2606 OID 22552)
-- Name: devices devices_imei_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key16 UNIQUE (imei);


--
-- TOC entry 4967 (class 2606 OID 22518)
-- Name: devices devices_imei_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key17 UNIQUE (imei);


--
-- TOC entry 4969 (class 2606 OID 22538)
-- Name: devices devices_imei_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key2 UNIQUE (imei);


--
-- TOC entry 4971 (class 2606 OID 22540)
-- Name: devices devices_imei_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key3 UNIQUE (imei);


--
-- TOC entry 4973 (class 2606 OID 22532)
-- Name: devices devices_imei_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key4 UNIQUE (imei);


--
-- TOC entry 4975 (class 2606 OID 22542)
-- Name: devices devices_imei_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key5 UNIQUE (imei);


--
-- TOC entry 4977 (class 2606 OID 22530)
-- Name: devices devices_imei_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key6 UNIQUE (imei);


--
-- TOC entry 4979 (class 2606 OID 22544)
-- Name: devices devices_imei_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key7 UNIQUE (imei);


--
-- TOC entry 4981 (class 2606 OID 22524)
-- Name: devices devices_imei_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key8 UNIQUE (imei);


--
-- TOC entry 4983 (class 2606 OID 22526)
-- Name: devices devices_imei_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_imei_key9 UNIQUE (imei);


--
-- TOC entry 4985 (class 2606 OID 18638)
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- TOC entry 5059 (class 2606 OID 75809)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 5061 (class 2606 OID 75829)
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (id);


--
-- TOC entry 5057 (class 2606 OID 18710)
-- Name: order_tracker order_tracker_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracker
    ADD CONSTRAINT order_tracker_pkey PRIMARY KEY (id);


--
-- TOC entry 5044 (class 2606 OID 18665)
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);


--
-- TOC entry 5051 (class 2606 OID 18691)
-- Name: payment_package payment_package_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_package
    ADD CONSTRAINT payment_package_pkey PRIMARY KEY (id);


--
-- TOC entry 5047 (class 2606 OID 18674)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 4829 (class 2606 OID 17501)
-- Name: status status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (id);


--
-- TOC entry 4822 (class 2606 OID 17177)
-- Name: statuses statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 4827 (class 2606 OID 17184)
-- Name: track_frame track_frame_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track_frame
    ADD CONSTRAINT track_frame_pkey PRIMARY KEY (id);


--
-- TOC entry 4869 (class 2606 OID 17614)
-- Name: trackers trackers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trackers
    ADD CONSTRAINT trackers_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 18594)
-- Name: type_client type_client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_client
    ADD CONSTRAINT type_client_pkey PRIMARY KEY (id);


--
-- TOC entry 4873 (class 2606 OID 18603)
-- Name: type_pay type_pay_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_pay
    ADD CONSTRAINT type_pay_pkey PRIMARY KEY (id);


--
-- TOC entry 4875 (class 2606 OID 18612)
-- Name: type_track type_track_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type_track
    ADD CONSTRAINT type_track_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 18649)
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 22444)
-- Name: vehicles vehicles_plate_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key UNIQUE (plate);


--
-- TOC entry 4992 (class 2606 OID 22442)
-- Name: vehicles vehicles_plate_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key1 UNIQUE (plate);


--
-- TOC entry 4994 (class 2606 OID 22434)
-- Name: vehicles vehicles_plate_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key10 UNIQUE (plate);


--
-- TOC entry 4996 (class 2606 OID 22456)
-- Name: vehicles vehicles_plate_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key11 UNIQUE (plate);


--
-- TOC entry 4998 (class 2606 OID 22458)
-- Name: vehicles vehicles_plate_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key12 UNIQUE (plate);


--
-- TOC entry 5000 (class 2606 OID 22432)
-- Name: vehicles vehicles_plate_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key13 UNIQUE (plate);


--
-- TOC entry 5002 (class 2606 OID 22460)
-- Name: vehicles vehicles_plate_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key14 UNIQUE (plate);


--
-- TOC entry 5004 (class 2606 OID 22430)
-- Name: vehicles vehicles_plate_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key15 UNIQUE (plate);


--
-- TOC entry 5006 (class 2606 OID 22462)
-- Name: vehicles vehicles_plate_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key16 UNIQUE (plate);


--
-- TOC entry 5008 (class 2606 OID 22464)
-- Name: vehicles vehicles_plate_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key17 UNIQUE (plate);


--
-- TOC entry 5010 (class 2606 OID 22428)
-- Name: vehicles vehicles_plate_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key18 UNIQUE (plate);


--
-- TOC entry 5012 (class 2606 OID 22466)
-- Name: vehicles vehicles_plate_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key19 UNIQUE (plate);


--
-- TOC entry 5014 (class 2606 OID 22446)
-- Name: vehicles vehicles_plate_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key2 UNIQUE (plate);


--
-- TOC entry 5016 (class 2606 OID 22426)
-- Name: vehicles vehicles_plate_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key20 UNIQUE (plate);


--
-- TOC entry 5018 (class 2606 OID 22468)
-- Name: vehicles vehicles_plate_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key21 UNIQUE (plate);


--
-- TOC entry 5020 (class 2606 OID 22470)
-- Name: vehicles vehicles_plate_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key22 UNIQUE (plate);


--
-- TOC entry 5022 (class 2606 OID 22424)
-- Name: vehicles vehicles_plate_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key23 UNIQUE (plate);


--
-- TOC entry 5024 (class 2606 OID 22472)
-- Name: vehicles vehicles_plate_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key24 UNIQUE (plate);


--
-- TOC entry 5026 (class 2606 OID 22474)
-- Name: vehicles vehicles_plate_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key25 UNIQUE (plate);


--
-- TOC entry 5028 (class 2606 OID 22422)
-- Name: vehicles vehicles_plate_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key26 UNIQUE (plate);


--
-- TOC entry 5030 (class 2606 OID 22440)
-- Name: vehicles vehicles_plate_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key3 UNIQUE (plate);


--
-- TOC entry 5032 (class 2606 OID 22438)
-- Name: vehicles vehicles_plate_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key4 UNIQUE (plate);


--
-- TOC entry 5034 (class 2606 OID 22448)
-- Name: vehicles vehicles_plate_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key5 UNIQUE (plate);


--
-- TOC entry 5036 (class 2606 OID 22436)
-- Name: vehicles vehicles_plate_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key6 UNIQUE (plate);


--
-- TOC entry 5038 (class 2606 OID 22450)
-- Name: vehicles vehicles_plate_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key7 UNIQUE (plate);


--
-- TOC entry 5040 (class 2606 OID 22452)
-- Name: vehicles vehicles_plate_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key8 UNIQUE (plate);


--
-- TOC entry 5042 (class 2606 OID 22454)
-- Name: vehicles vehicles_plate_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_plate_key9 UNIQUE (plate);


--
-- TOC entry 4876 (class 1259 OID 75802)
-- Name: clients_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX clients_email ON public.clients USING btree (email);


--
-- TOC entry 4947 (class 1259 OID 22905)
-- Name: idx_clients_type_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clients_type_client ON public.clients USING btree (type_client_id);


--
-- TOC entry 5052 (class 1259 OID 22914)
-- Name: idx_orders_arrival; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_arrival ON public.order_tracker USING btree (arrival_date);


--
-- TOC entry 5053 (class 1259 OID 22910)
-- Name: idx_orders_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_client ON public.order_tracker USING btree (client_id);


--
-- TOC entry 5054 (class 1259 OID 22915)
-- Name: idx_orders_departure; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_departure ON public.order_tracker USING btree (departure_date);


--
-- TOC entry 5055 (class 1259 OID 22911)
-- Name: idx_orders_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_vehicle ON public.order_tracker USING btree (vehicle_id);


--
-- TOC entry 5048 (class 1259 OID 22908)
-- Name: idx_payment_package_package; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_package_package ON public.payment_package USING btree (package_id);


--
-- TOC entry 5049 (class 1259 OID 22907)
-- Name: idx_payment_package_pay; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_package_pay ON public.payment_package USING btree (pay_id);


--
-- TOC entry 5045 (class 1259 OID 22906)
-- Name: idx_payments_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_client ON public.payments USING btree (client_id);


--
-- TOC entry 4823 (class 1259 OID 22916)
-- Name: idx_track_frame_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_track_frame_created ON public.track_frame USING btree (create_date);


--
-- TOC entry 4824 (class 1259 OID 22912)
-- Name: idx_track_frame_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_track_frame_order ON public.track_frame USING btree (order_tracker_id);


--
-- TOC entry 4825 (class 1259 OID 22913)
-- Name: idx_track_frame_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_track_frame_status ON public.track_frame USING btree (status_id);


--
-- TOC entry 4986 (class 1259 OID 22909)
-- Name: idx_vehicles_client; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_client ON public.vehicles USING btree (client_id);


--
-- TOC entry 5065 (class 2606 OID 75815)
-- Name: Locations Locations_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Locations"
    ADD CONSTRAINT "Locations_device_id_fkey" FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- TOC entry 5068 (class 2606 OID 75797)
-- Name: payments fk_payments_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES public.order_tracker(id);


--
-- TOC entry 5076 (class 2606 OID 75810)
-- Name: locations locations_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5077 (class 2606 OID 75830)
-- Name: order_details order_details_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.order_tracker(id) ON DELETE CASCADE;


--
-- TOC entry 5073 (class 2606 OID 22500)
-- Name: order_tracker order_tracker_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracker
    ADD CONSTRAINT order_tracker_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5074 (class 2606 OID 22510)
-- Name: order_tracker order_tracker_type_track_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracker
    ADD CONSTRAINT order_tracker_type_track_id_fkey FOREIGN KEY (type_track_id) REFERENCES public.type_track(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5075 (class 2606 OID 22505)
-- Name: order_tracker order_tracker_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_tracker
    ADD CONSTRAINT order_tracker_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5071 (class 2606 OID 22495)
-- Name: payment_package payment_package_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_package
    ADD CONSTRAINT payment_package_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5072 (class 2606 OID 22490)
-- Name: payment_package payment_package_pay_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_package
    ADD CONSTRAINT payment_package_pay_id_fkey FOREIGN KEY (pay_id) REFERENCES public.payments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5069 (class 2606 OID 22480)
-- Name: payments payments_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5070 (class 2606 OID 22485)
-- Name: payments payments_type_pay_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_type_pay_id_fkey FOREIGN KEY (type_pay_id) REFERENCES public.type_pay(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5064 (class 2606 OID 22553)
-- Name: track_frame track_frame_order_tracker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track_frame
    ADD CONSTRAINT track_frame_order_tracker_id_fkey FOREIGN KEY (order_tracker_id) REFERENCES public.order_tracker(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5066 (class 2606 OID 22558)
-- Name: trackers trackers_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trackers
    ADD CONSTRAINT "trackers_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.order_tracker(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5067 (class 2606 OID 22475)
-- Name: vehicles vehicles_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-08-05 15:37:39

--
-- PostgreSQL database dump complete
--

