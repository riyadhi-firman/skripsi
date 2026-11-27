--
-- PostgreSQL database dump
--

\restrict no3dKlwgQB5jCxQpUiSBKajA89EWMTXNpuB9dMZlcfiHTBgnxwP2ikwivjwWW6x

-- Dumped from database version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alert_histories; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.alert_histories (
    id bigint NOT NULL,
    alert_id bigint NOT NULL,
    action character varying(255) NOT NULL,
    description text NOT NULL,
    user_id bigint,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.alert_histories OWNER TO ubj_user;

--
-- Name: alert_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.alert_histories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alert_histories_id_seq OWNER TO ubj_user;

--
-- Name: alert_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.alert_histories_id_seq OWNED BY public.alert_histories.id;


--
-- Name: alerts; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.alerts (
    id bigint NOT NULL,
    device_id bigint NOT NULL,
    type character varying(255) NOT NULL,
    severity character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    status character varying(255) DEFAULT 'OPEN'::character varying NOT NULL,
    triggered_at timestamp(0) without time zone NOT NULL,
    acknowledged_at timestamp(0) without time zone,
    resolved_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    alert_type character varying(255)
);


ALTER TABLE public.alerts OWNER TO ubj_user;

--
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.alerts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_id_seq OWNER TO ubj_user;

--
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    user_id bigint,
    action character varying(255) NOT NULL,
    module character varying(255) NOT NULL,
    description text NOT NULL,
    ip_address character varying(45),
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO ubj_user;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO ubj_user;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache OWNER TO ubj_user;

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO ubj_user;

--
-- Name: devices; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.devices (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    hostname character varying(255),
    ip_address character varying(255) NOT NULL,
    device_type character varying(255) DEFAULT 'Other'::character varying NOT NULL,
    vendor character varying(255),
    model character varying(255),
    location character varying(255),
    snmp_version character varying(255) DEFAULT 'v2c'::character varying NOT NULL,
    snmp_community text,
    snmp_port integer DEFAULT 161 NOT NULL,
    snmp_security_level character varying(255),
    snmp_auth_protocol character varying(255),
    snmp_auth_password text,
    snmp_priv_protocol character varying(255),
    snmp_priv_password text,
    monitoring_interval integer DEFAULT 30 NOT NULL,
    timeout integer DEFAULT 5 NOT NULL,
    retry integer DEFAULT 2 NOT NULL,
    monitoring_enabled boolean DEFAULT true NOT NULL,
    status character varying(255) DEFAULT 'UNKNOWN'::character varying NOT NULL,
    latency double precision,
    packet_loss double precision,
    cpu_usage double precision,
    memory_usage double precision,
    uptime bigint,
    pos_x integer,
    pos_y integer,
    last_checked_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.devices OWNER TO ubj_user;

--
-- Name: devices_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.devices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devices_id_seq OWNER TO ubj_user;

--
-- Name: devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.devices_id_seq OWNED BY public.devices.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection character varying(255) NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO ubj_user;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO ubj_user;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: interface_metrics; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.interface_metrics (
    id bigint NOT NULL,
    interface_id bigint NOT NULL,
    input_octets bigint DEFAULT '0'::bigint NOT NULL,
    output_octets bigint DEFAULT '0'::bigint NOT NULL,
    input_errors bigint DEFAULT '0'::bigint NOT NULL,
    output_errors bigint DEFAULT '0'::bigint NOT NULL,
    utilization double precision DEFAULT '0'::double precision NOT NULL,
    recorded_at timestamp(0) without time zone NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.interface_metrics OWNER TO ubj_user;

--
-- Name: interface_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.interface_metrics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interface_metrics_id_seq OWNER TO ubj_user;

--
-- Name: interface_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.interface_metrics_id_seq OWNED BY public.interface_metrics.id;


--
-- Name: interfaces; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.interfaces (
    id bigint NOT NULL,
    device_id bigint NOT NULL,
    if_index integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    admin_status character varying(255) DEFAULT 'UNKNOWN'::character varying NOT NULL,
    oper_status character varying(255) DEFAULT 'UNKNOWN'::character varying NOT NULL,
    speed bigint DEFAULT '0'::bigint NOT NULL,
    in_octets bigint DEFAULT '0'::bigint NOT NULL,
    out_octets bigint DEFAULT '0'::bigint NOT NULL,
    in_errors bigint DEFAULT '0'::bigint NOT NULL,
    out_errors bigint DEFAULT '0'::bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.interfaces OWNER TO ubj_user;

--
-- Name: interfaces_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.interfaces_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.interfaces_id_seq OWNER TO ubj_user;

--
-- Name: interfaces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.interfaces_id_seq OWNED BY public.interfaces.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


ALTER TABLE public.job_batches OWNER TO ubj_user;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


ALTER TABLE public.jobs OWNER TO ubj_user;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO ubj_user;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO ubj_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO ubj_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: monitoring_results; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.monitoring_results (
    id bigint NOT NULL,
    device_id bigint NOT NULL,
    status character varying(255) NOT NULL,
    latency double precision,
    packet_loss double precision DEFAULT '0'::double precision NOT NULL,
    cpu_usage double precision,
    memory_usage double precision,
    uptime bigint,
    checked_at timestamp(0) without time zone NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.monitoring_results OWNER TO ubj_user;

--
-- Name: monitoring_results_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.monitoring_results_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.monitoring_results_id_seq OWNER TO ubj_user;

--
-- Name: monitoring_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.monitoring_results_id_seq OWNED BY public.monitoring_results.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO ubj_user;

--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO ubj_user;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO ubj_user;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO ubj_user;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.settings (
    id bigint NOT NULL,
    key character varying(255) NOT NULL,
    value text NOT NULL,
    type character varying(255) DEFAULT 'string'::character varying NOT NULL,
    description character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.settings OWNER TO ubj_user;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO ubj_user;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: topology_edges; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.topology_edges (
    id bigint NOT NULL,
    source_device_id bigint NOT NULL,
    target_device_id bigint NOT NULL,
    source_interface_id bigint,
    target_interface_id bigint,
    label character varying(255),
    status character varying(255) DEFAULT 'UP'::character varying NOT NULL,
    bandwidth character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.topology_edges OWNER TO ubj_user;

--
-- Name: topology_edges_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.topology_edges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.topology_edges_id_seq OWNER TO ubj_user;

--
-- Name: topology_edges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.topology_edges_id_seq OWNED BY public.topology_edges.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: ubj_user
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'operator'::character varying NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.users OWNER TO ubj_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: ubj_user
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO ubj_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ubj_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: alert_histories id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.alert_histories ALTER COLUMN id SET DEFAULT nextval('public.alert_histories_id_seq'::regclass);


--
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: devices id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.devices ALTER COLUMN id SET DEFAULT nextval('public.devices_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: interface_metrics id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.interface_metrics ALTER COLUMN id SET DEFAULT nextval('public.interface_metrics_id_seq'::regclass);


--
-- Name: interfaces id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.interfaces ALTER COLUMN id SET DEFAULT nextval('public.interfaces_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: monitoring_results id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.monitoring_results ALTER COLUMN id SET DEFAULT nextval('public.monitoring_results_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: topology_edges id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.topology_edges ALTER COLUMN id SET DEFAULT nextval('public.topology_edges_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alert_histories; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.alert_histories (id, alert_id, action, description, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.alerts (id, device_id, type, severity, title, message, status, triggered_at, acknowledged_at, resolved_at, created_at, updated_at, alert_type) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.audit_logs (id, user_id, action, module, description, ip_address, created_at) FROM stdin;
1	1	SYSTEM_INIT	System	Inisialisasi sistem NMS Universitas Banten Jaya dengan dataset demo.	127.0.0.1	2026-11-26 03:55:54
2	1	DEVICE_CREATE	Perangkat	Admin menambahkan perangkat DEMO-Core-Router (10.10.0.1)	127.0.0.1	2026-11-26 09:55:54
3	2	ALERT_ACK	Peringatan	Operator mengakui peringatan HIGH_LATENCY pada DEMO-Distribution-01	127.0.0.1	2026-11-27 02:55:54
4	1	DEVICE_IMPORT	DeviceManagement	Import 16 perangkat jaringan kampus UBJ.	127.0.0.1	2026-11-27 07:36:37
5	1	LOGIN	Autentikasi	Pengguna Administrator Jaringan UBJ berhasil login (admin)	103.140.131.161	2026-11-27 07:44:40
6	1	LOGIN	Autentikasi	Pengguna Administrator Jaringan UBJ berhasil login (admin)	103.140.131.161	2026-11-27 07:45:34
7	1	LOGIN	Autentikasi	Pengguna Administrator Jaringan UBJ berhasil login (admin)	103.140.131.161	2026-11-27 07:58:14
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.devices (id, name, hostname, ip_address, device_type, vendor, model, location, snmp_version, snmp_community, snmp_port, snmp_security_level, snmp_auth_protocol, snmp_auth_password, snmp_priv_protocol, snmp_priv_password, monitoring_interval, timeout, retry, monitoring_enabled, status, latency, packet_loss, cpu_usage, memory_usage, uptime, pos_x, pos_y, last_checked_at, created_at, updated_at) FROM stdin;
5	UBJ-SW-Distribusi-Ciwaru	ds01.ciwaru.ubj.ac.id	192.168.50.10	Switch	Cisco	Catalyst 2960-24TT-L	Ruang Server Lt. 2 (Kampus 1 Ciwaru)	v2c	eyJpdiI6Ik9ZZVpvUTl3Ui9LNlR3U2VPczBlbVE9PSIsInZhbHVlIjoid0lmYXlNaG9GM0s2cXpjQUFQY0VDNHZQOUl3aFV3SmVjVzZTOEFqNGdrZz0iLCJtYWMiOiIyOGZkNTRjMTY1NWFkNWFjZWZjZGYzZTUzMzRmYjI1OTg1ZGI1ZTk5MWE4OWI2YTAzMzI5ZThiODc3NmEwODQ1IiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	ONLINE	5.2	0	24	42	578412	360	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
1	UBJ-FW-FortiGate-100F	fw01.ubj.ac.id	192.168.10.2	Firewall	Fortinet	FortiGate 100F	Data Center Gedung A Lantai 1 (Kampus 2 Curug)	v2c	eyJpdiI6IlRSWVNqUVE2TlEvMTRyeiswRElsbnc9PSIsInZhbHVlIjoiNmgrZ0pWbGNtMThNMWtNMEJBNUxqRWhNaTJ5aU5FbjFWV3pZbnIwSEZoYz0iLCJtYWMiOiJhZGQ2MTE5NDE0ODA1ZDhjMzg5MDdlMWM2ODEzNzJmMDcyZTBlNjc1MmE2NjI0NmYxYTRkMWJiYjc4YzlkZWNhIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	ONLINE	4.3	0	41	33	1266778	620	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
3	UBJ-GW-Ciwaru-CCR1009	gw01.ciwaru.ubj.ac.id	192.168.50.1	Router	MikroTik	CCR1009-7G-1C-1S+	Ruang Jaringan Lt. 1 (Kampus 1 Ciwaru)	v2c	eyJpdiI6InB6TnpFMDJEdnIvT3h3Vmo0Z1BWeVE9PSIsInZhbHVlIjoiQTdTbHJGYkJ2cHJvNUdXN3Izc3JuTUJ1TGpRSHJockZrdVhHdGIvZUlsbz0iLCJtYWMiOiIwODFiYzU2ZWZhZmZiYWEzZDI2YzBhYTNlMzVmODgyOTY5NDE4M2RjMjMxNThiNGY1YWQyOTljYThmZTY3OTAwIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	ONLINE	7	0	47	59	2430744	880	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
7	UBJ-DS-GedungB-FTI	ds02.curug.ubj.ac.id	192.168.20.1	Switch	Ruijie	RG-S2910-24GT4SFP-P-E	Ruang Server FTI Gedung B Lt. 2	v2c	eyJpdiI6InBoVDFiTXZNRVNmZzcwaS81RmJJMWc9PSIsInZhbHVlIjoieTU0R0I2ZURBc3R2UkQ3Q2UyVzNnQlVGVEl6RU9FeUQraU9TUlZFUFN3dz0iLCJtYWMiOiI2NWU4ZjBlNDcxNjE5ZDRlNGVhZDczMjRmNTk1YmFkMThlM2M0MjExYjc4MDM3OWYzOWM5ZGE3ZjkxODA0ZmRkIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	ONLINE	8.3	0	36	61	1125129	1140	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
10	UBJ-AP-Perpustakaan-Lt2	ap-perpus.curug.ubj.ac.id	192.168.10.52	Access Point	Ubiquiti	UniFi U6 Pro	Perpustakaan Pusat Gedung A Lantai 2	v2c	eyJpdiI6IlJaaWJYOGc2UDhrN3krVkE4YUp2ZFE9PSIsInZhbHVlIjoiWXhkRGpyNjhJUnZnbnpCczY2V2pLSEVwSXJySTJoZnltekpYenNqRERnbz0iLCJtYWMiOiI4YjIzN2ZiY2Q4OTIzNDgwZjlmNGEzNmYxZGMyNGRjNjk3YmQ3YTM1YzJjZWJhMDRjZDhlYjU2NDZhYWY4MzkwIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	DOWN	7.4	0	46	58	3207553	2700	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
8	UBJ-DS-GedungC-FEB-FKIP	ds03.curug.ubj.ac.id	192.168.30.1	Switch	Ruijie	RG-S2910-24GT4SFP-P-E	Ruang Server Gedung C Lt. 2	v2c	eyJpdiI6InlpeTNEWG02TGJiRzljMmphMVVnK1E9PSIsInZhbHVlIjoiZXNOS3l6emhBM01YNWE2QkxlNzdjbU1OM2Rtdk9nTGkxM0paNi9VUStVND0iLCJtYWMiOiI0NDRkNzMwZmM3M2RlYTVlZmRhMzJlZGFjYzIwN2Y3MDhiZWQwZTQ5YmYzMWE2M2MyOWRkNmI2MzlhYWNlNmMxIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	ONLINE	3.9	0	35	43	2383248	1400	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
12	UBJ-AP-GedungC-Auditorium	ap-audit.curug.ubj.ac.id	192.168.30.50	Access Point	Ubiquiti	UniFi U6 Pro	Auditorium & Ruang Kuliah Gedung C Lantai 3	v2c	eyJpdiI6ImtEWjFNRDNwbnM3REJXK3hXMFFHZHc9PSIsInZhbHVlIjoiRFpJSS9JeEVhQWZJQXYrN2VJMEZ4N0JvS0gydnpkMUFYOVkyQUpubjhxVT0iLCJtYWMiOiJmM2FkYzRlMzNlOTY0Mzg3M2RiMjQxMWI5NzJkOWQxOWUyNmIzNWM0OGNkOWU3MTEyZmE1OWRiNjhiYTgxNDg4IiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	ONLINE	7.7	0	36	56	3197958	1660	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
13	UBJ-AP-Ciwaru-Lobby	ap01.ciwaru.ubj.ac.id	192.168.50.50	Access Point	Ubiquiti	UniFi U6 Lite	Lobby & Ruang Kuliah Kampus 1 Ciwaru Lantai 1	v2c	eyJpdiI6IkFYU0kwWldEa2xVeTMzYTdFdDVtRVE9PSIsInZhbHVlIjoiSG0xQzhMNHBCNGVNK3lCMmNnbVJtU2ZRTlRQcHFFbFNVTkNOM28yYXhBWT0iLCJtYWMiOiJjYjA4M2U3YmU4NjZkOGY3Mzg5MWM1M2ZmMWNjMjFlMDlkNjU2ZjQ2ODQ3OGNiNmVhZmUyNTQ2YzBhYjczODc2IiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	ONLINE	4.3	0	43	44	349118	1920	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
14	UBJ-SRV-SIAKAD	siakad.ubj.ac.id	192.168.10.100	Server	Dell	PowerEdge R640	Data Center Gedung A Lantai 1 (Curug)	v2c	eyJpdiI6IlBGMGZTOGF5SEp5SjF1SHpQemtrNXc9PSIsInZhbHVlIjoiL3NPMHBRNzZtbEU5d2Nyd3VEZVBPcUlmemhDR081T1F4cDRPTnltQngvQT0iLCJtYWMiOiIyMTVlMzBiMjMxYzU3MzAxZWJkNmNlN2ExODQ5NjgzNTkzZmU1NTNiMWIzNGIzODJlOGIyNmNiYTE5ZTFjMDU3IiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	DOWN	1.5	0	34	60	838978	2440	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
16	UBJ-SRV-Web-Portal	portal.ubj.ac.id	192.168.10.102	Server	HPE	ProLiant DL360 Gen10	Data Center Gedung A Lantai 1 (Curug)	v2c	eyJpdiI6ImlJUk84T3gvSWVSU21zUWRZZW9TS2c9PSIsInZhbHVlIjoieFBzRWtYQi83SHVWUW16MXZZRUxka0J5elBnS00rQTBwdlJ0VDE1MTZoUT0iLCJtYWMiOiIwNjVlZWI0ZDM1ZGQ1MjQ5ZjlhY2M5NjQ3NzM3NmIyZDg1OTRiMjJiODdhNmVmMDVlZmEyNTFiN2Y5ZDgxNjQ4IiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	DOWN	5.9	0	26	55	1991341	100	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
6	UBJ-DS-GedungA-Rektorat	ds01.curug.ubj.ac.id	192.168.10.20	Switch	Ruijie	RG-S2910-24GT4SFP-P-E	Ruang Server Rektorat Gedung A Lt. 2	v2c	eyJpdiI6IlcrWURaOGEwcHpmVFJSV2g1ZVhkZWc9PSIsInZhbHVlIjoiZ0xQTHRucTNkVzVwdjFCNGdUS1RPcEYxSTl5d1BzSENLSk12UEIvbUVTMD0iLCJtYWMiOiIyZTI4MjUxMDcxZTZkZDhmNzk2NmMxM2RlOTAzNmJiMDYzZjlmMzVlZWY2ODgyMmEwNjRhMTUwYTc0NDYyZWFhIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	DOWN	3.5	0	32	41	3181427	2960	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
9	UBJ-AP-Rektorat-Lobby	ap-rektorat.curug.ubj.ac.id	192.168.10.51	Access Point	Ubiquiti	UniFi U6 Pro	Gedung Rektorat Lantai 1 (Lobby)	v2c	eyJpdiI6ImNvcFdqdkNkNEdVM0kxRzZyRUNyMHc9PSIsInZhbHVlIjoiNmZYZ04xek9XQjBpbkxvcWZ1blJNZ2NReTR1RDNSaVJjUFFycGJmdlpLaz0iLCJtYWMiOiJmMWM3ODU4Mzk4NTMzYzczM2U2ODJlNjIyMDQ0NTkwZTI3ZmU0OTAzM2I2OGRmN2RmNGJmNmZkMDc2NTU1MDQyIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	DOWN	5.8	0	35	43	3004430	3220	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
15	UBJ-SRV-Elearning-LMS	elearning.ubj.ac.id	192.168.10.101	Server	Dell	PowerEdge R640	Data Center Gedung A Lantai 1 (Curug)	v2c	eyJpdiI6IjBOelV6ODM2NUc1UFVWSmRrOTdpeFE9PSIsInZhbHVlIjoiaXhhNy96eXRFbEFWU1NhdlpxSjJEakFWVzdEUjdnWGJ2K2Zjc0ZxczJUST0iLCJtYWMiOiI0MmE5ZGVhMzNhODU2MDc3YTk0NjFkYzViYmNkYWQxMjRhMzhiODExMTYwNWVjNTAxM2QxN2FjODNmOWUzN2Y5IiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	DOWN	5.1	0	47	52	485882	2180	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:25:10
2	UBJ-GW-Core-CCR1036	cr01.curug.ubj.ac.id	192.168.10.1	Router	MikroTik	CCR1036-8G-2S+	Data Center Gedung A Lantai 1 (Kampus 2 Curug)	v2c	eyJpdiI6InFHT0NwRVFKM2p1TVdJUmJUSytIQVE9PSIsInZhbHVlIjoiNlB3YUI1dVFwZ2VlbjJLVG5lNXd3M3RoclA2ZW9ORlhUTVkyUmZYTitrVT0iLCJtYWMiOiIwYTMxMjQ1YTM2YmEzY2I5M2Q1ODU2NzQ4Yzg2ZmU0YzVkODA0YjI4OThkN2RlNjg0N2YzMTY1ZGJiOWU1OGFmIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	UP	7	0	1.3333333333333	41.9	1843113	3480	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:27:51
11	UBJ-AP-Lab-Komputer-FTI	ap-labfti.curug.ubj.ac.id	192.168.20.50	Access Point	Ubiquiti	UniFi U6-LR	Lab Komputer Terpadu Gedung B Lantai 3	v2c	eyJpdiI6IlhRVXlTRGxpQW03UUFmT21XSThZNEE9PSIsInZhbHVlIjoiOTVvdU5QNWpkM0EvZHBaZktVTTh3L3RVdEZCZUxrQlpzc2RMRE50eWxLUT0iLCJtYWMiOiI1YTg1YjBjNWJmNDBkNDNjZjlmM2NmYzhmYTBkY2ZiYmYxNTYxOTJjNGM3MDlhMzA0MWFlMWI5NGZhMTZlYWUyIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	ONLINE	8.3	0	45	48	2790755	3740	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
4	UBJ-CS-Core-Catalyst3850	cs01.curug.ubj.ac.id	192.168.10.10	Switch	Cisco	Catalyst 3850-48P-L	Data Center Gedung A Lantai 1 (Kampus 2 Curug)	v2c	eyJpdiI6Ilp5Z2d4UURmeUp0VXVtOW5tOGozSXc9PSIsInZhbHVlIjoidVdWakFpSEtvNDBVUjJETG1kdlF0MXNoTUJPcElTUWo5WmFmRm5aUTE0dz0iLCJtYWMiOiI4OGZhMWFjNDM2YTMzMTNmZTlkYWYwMWFjMDRiYWY5ZGEwNmE4ZDY3MDU4NWYxYzdmNzNmMTM5YzA2MjQ4ZDViIiwidGFnIjoiIn0=	161	\N	\N	\N	\N	\N	30	5	2	t	DOWN	3.5	0	39	51	922964	4000	100	2026-11-27 07:36:36	2026-11-27 07:36:36	2026-11-27 08:24:20
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: interface_metrics; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.interface_metrics (id, interface_id, input_octets, output_octets, input_errors, output_errors, utilization, recorded_at, created_at) FROM stdin;
1	14	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
2	15	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
3	16	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
4	17	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
5	18	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
6	19	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
7	20	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
8	21	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
9	22	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
10	23	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
11	24	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
12	25	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
13	26	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
14	27	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
15	28	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
16	29	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
17	30	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
18	31	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
19	32	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
20	33	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
21	34	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
22	35	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
23	36	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
24	37	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
25	38	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
26	39	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
27	40	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
28	41	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
29	42	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
30	43	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
31	44	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
32	45	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
33	46	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
34	47	0	0	0	0	5.2	2026-11-27 08:13:57	2026-11-27 08:13:57
35	28	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
36	44	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
37	42	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
38	33	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
39	24	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
40	35	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
41	27	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
42	21	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
43	45	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
44	39	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
45	20	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
46	40	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
47	15	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
48	47	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
49	46	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
50	37	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
51	38	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
52	22	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
53	32	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
54	30	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
55	17	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
56	31	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
57	25	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
58	41	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
59	34	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
60	19	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
61	43	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
62	23	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
63	29	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
64	18	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
65	16	0	0	0	0	0	2026-11-27 08:16:53	2026-11-27 08:16:53
66	14	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
67	36	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
68	26	0	0	0	0	5.2	2026-11-27 08:16:53	2026-11-27 08:16:53
69	25	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
70	18	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
71	45	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
72	38	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
73	21	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
74	19	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
75	47	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
76	23	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
77	20	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
78	36	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
79	16	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
80	22	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
81	30	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
82	14	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
83	32	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
84	34	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
85	28	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
86	31	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
87	42	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
88	40	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
89	41	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
90	43	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
91	37	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
92	26	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
93	15	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
94	33	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
95	24	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
96	44	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
97	46	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
98	39	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
99	35	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
100	29	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
101	27	0	0	0	0	5.2	2026-11-27 08:19:52	2026-11-27 08:19:52
102	17	0	0	0	0	0	2026-11-27 08:19:52	2026-11-27 08:19:52
103	23	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
104	36	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
105	14	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
106	42	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
107	25	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
108	22	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
109	19	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
110	16	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
111	31	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
112	15	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
113	43	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
114	21	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
115	44	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
116	37	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
117	47	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
118	39	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
119	20	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
120	35	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
121	40	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
122	30	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
123	17	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
124	26	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
125	32	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
126	33	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
127	45	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
128	34	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
129	41	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
130	27	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
131	24	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
132	29	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
133	46	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
134	28	0	0	0	0	0	2026-11-27 08:22:48	2026-11-27 08:22:48
135	18	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
136	38	0	0	0	0	5.2	2026-11-27 08:22:48	2026-11-27 08:22:48
137	31	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
138	25	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
139	34	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
140	44	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
141	45	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
142	38	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
143	28	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
144	24	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
145	37	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
146	47	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
147	26	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
148	40	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
149	17	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
150	15	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
151	35	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
152	30	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
153	36	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
154	32	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
155	43	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
156	46	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
157	41	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
158	19	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
159	20	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
160	39	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
161	29	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
162	33	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
163	22	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
164	18	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
165	16	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
166	42	0	0	0	0	0	2026-11-27 08:24:30	2026-11-27 08:24:30
167	14	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
168	27	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
169	21	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
170	23	0	0	0	0	5.2	2026-11-27 08:24:30	2026-11-27 08:24:30
171	26	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
172	34	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
173	20	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
174	29	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
175	44	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
176	47	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
177	36	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
178	43	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
179	38	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
180	19	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
181	40	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
182	41	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
183	15	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
184	21	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
185	33	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
186	24	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
187	18	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
188	32	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
189	30	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
190	37	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
191	39	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
192	31	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
193	22	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
194	46	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
195	17	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
196	25	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
197	45	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
198	28	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
199	23	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
200	35	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
201	27	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
202	16	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
203	42	0	0	0	0	0	2026-11-27 08:24:59	2026-11-27 08:24:59
204	14	0	0	0	0	5.2	2026-11-27 08:24:59	2026-11-27 08:24:59
205	36	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
206	37	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
207	29	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
208	17	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
209	25	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
210	33	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
211	44	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
212	22	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
213	34	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
214	40	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
215	30	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
216	16	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
217	43	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
218	38	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
219	23	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
220	14	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
221	21	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
222	46	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
223	35	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
224	26	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
225	45	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
226	47	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
227	24	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
228	31	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
229	41	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
230	15	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
231	19	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
232	20	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
233	42	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
234	18	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
235	27	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
236	32	0	0	0	0	5.2	2026-11-27 08:25:18	2026-11-27 08:25:18
237	28	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
238	39	0	0	0	0	0	2026-11-27 08:25:18	2026-11-27 08:25:18
239	26	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
240	18	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
241	27	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
242	45	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
243	22	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
244	24	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
245	29	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
246	14	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
247	37	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
248	46	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
249	40	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
250	31	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
251	42	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
252	23	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
253	35	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
254	34	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
255	41	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
256	36	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
257	17	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
258	43	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
259	21	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
260	20	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
261	16	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
262	15	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
263	19	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
264	39	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
265	33	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
266	47	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
267	38	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
268	28	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
269	44	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
270	30	0	0	0	0	0	2026-11-27 08:25:58	2026-11-27 08:25:58
271	25	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
272	32	0	0	0	0	5.2	2026-11-27 08:25:58	2026-11-27 08:25:58
273	35	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
274	22	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
275	19	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
276	16	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
277	15	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
278	40	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
279	43	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
280	46	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
281	34	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
282	28	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
283	23	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
284	14	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
285	26	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
286	29	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
287	41	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
288	36	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
289	17	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
290	38	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
291	47	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
292	42	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
293	27	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
294	32	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
295	33	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
296	44	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
297	37	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
298	30	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
299	18	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
300	21	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
301	39	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
302	20	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
303	31	0	0	0	0	0	2026-11-27 08:26:39	2026-11-27 08:26:39
304	25	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
305	45	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
306	24	0	0	0	0	5.2	2026-11-27 08:26:39	2026-11-27 08:26:39
307	28	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
308	32	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
309	30	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
310	25	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
311	26	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
312	46	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
313	43	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
314	15	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
315	21	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
316	33	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
317	23	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
318	44	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
319	39	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
320	20	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
321	36	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
322	37	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
323	27	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
324	41	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
325	45	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
326	35	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
327	29	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
328	17	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
329	31	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
330	14	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
331	47	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
332	24	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
333	40	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
334	16	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
335	42	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
336	18	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
337	38	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
338	22	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
339	34	0	0	0	0	0	2026-11-27 08:27:19	2026-11-27 08:27:19
340	19	0	0	0	0	5.2	2026-11-27 08:27:19	2026-11-27 08:27:19
341	30	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
342	22	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
343	34	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
344	16	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
345	19	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
346	32	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
347	26	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
348	21	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
349	28	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
350	42	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
351	27	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
352	15	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
353	33	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
354	45	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
355	47	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
356	39	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
357	29	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
358	36	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
359	25	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
360	18	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
361	43	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
362	46	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
363	17	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
364	31	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
365	14	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
366	44	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
367	37	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
368	38	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
369	23	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
370	20	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
371	40	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
372	41	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
373	24	0	0	0	0	5.2	2026-11-27 08:29:26	2026-11-27 08:29:26
374	35	0	0	0	0	0	2026-11-27 08:29:26	2026-11-27 08:29:26
375	41	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
376	36	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
377	31	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
378	34	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
379	47	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
380	29	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
381	16	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
382	14	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
383	18	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
384	43	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
385	21	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
386	19	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
387	30	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
388	26	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
389	32	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
390	22	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
391	25	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
392	33	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
393	45	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
394	38	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
395	20	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
396	27	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
397	15	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
398	28	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
399	23	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
400	39	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
401	40	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
402	17	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
403	42	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
404	44	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
405	46	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
406	24	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
407	37	0	0	0	0	5.2	2026-11-27 08:32:11	2026-11-27 08:32:11
408	35	0	0	0	0	0	2026-11-27 08:32:11	2026-11-27 08:32:11
409	22	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
410	38	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
411	46	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
412	34	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
413	23	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
414	39	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
415	42	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
416	24	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
417	47	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
418	40	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
419	36	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
420	31	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
421	14	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
422	26	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
423	41	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
424	43	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
425	15	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
426	20	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
427	25	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
428	44	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
429	45	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
430	28	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
431	35	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
432	30	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
433	32	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
434	19	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
435	29	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
436	21	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
437	37	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
438	27	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
439	17	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
440	18	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
441	16	0	0	0	0	0	2026-11-27 08:35:08	2026-11-27 08:35:08
442	33	0	0	0	0	5.2	2026-11-27 08:35:08	2026-11-27 08:35:08
443	40	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
444	14	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
445	33	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
446	46	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
447	35	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
448	41	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
449	16	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
450	42	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
451	27	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
452	22	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
453	28	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
454	47	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
455	20	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
456	36	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
457	17	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
458	18	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
459	43	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
460	38	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
461	29	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
462	21	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
463	34	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
464	19	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
465	25	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
466	37	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
467	45	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
468	23	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
469	31	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
470	15	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
471	30	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
472	24	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
473	26	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
474	32	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
475	44	0	0	0	0	5.2	2026-11-27 08:38:05	2026-11-27 08:38:05
476	39	0	0	0	0	0	2026-11-27 08:38:05	2026-11-27 08:38:05
\.


--
-- Data for Name: interfaces; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.interfaces (id, device_id, if_index, name, description, admin_status, oper_status, speed, in_octets, out_octets, in_errors, out_errors, created_at, updated_at) FROM stdin;
16	2	5	ether4	ether4	UP	DOWN	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
17	2	6	ether5	ether5	UP	DOWN	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
30	2	3	ether2	ether2	UP	DOWN	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
31	2	7	ether6	ether6	UP	DOWN	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
41	2	2	ether1	ether1	UP	DOWN	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
42	2	8	ether7	ether7	UP	DOWN	0	0	0	0	0	2026-11-27 08:13:57	2026-11-27 08:13:57
37	2	23	vlan99	vlan99	UP	UP	1000000000	0	27901088	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
45	2	45	vlan144-Hotspot	vlan144-Hotspot	UP	UP	1000000000	665580709	236725056	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
23	2	59	vlan102-CILEGON	vlan102-CILEGON	UP	UP	1000000000	3304054048	2141552954	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
15	2	18	vlan707	vlan707	UP	UP	1000000000	888575368	4115545872	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
24	2	60	VLAN5	VLAN5	UP	UP	1000000000	1079137414	177262353	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
26	2	13	vlan104-PNTG	vlan104-PNTG	UP	UP	1000000000	4196530801	1311193518	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
28	2	57	lo1	lo1	UP	UP	0	27371844	27371844	0	0	2026-11-27 08:13:57	2026-11-27 08:19:52
40	2	1	combo1	combo1	UP	UP	1000000000	3612848733	1813611200	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
14	2	10	vlan108-CIRUAS	vlan108-CIRUAS	UP	UP	1000000000	2512480937	1751244510	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
32	2	16	vlan50-MGMT-GK2	vlan50-MGMT-GK2	UP	UP	1000000000	53497797	2124945743	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
33	2	20	vlan70-MGMT-BAROS	vlan70-MGMT-BAROS	UP	UP	1000000000	0	80380708	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
46	2	50	vlan97	vlan97	UP	UP	1000000000	3504653535	3338555361	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
44	2	21	vlan2149-VIA-AKEN	vlan2149-VIA-AKEN	UP	UP	1000000000	0	33001936	0	0	2026-11-27 08:13:57	2026-11-27 08:38:06
35	2	15794901	<l2tp-srg-dude>	<l2tp-srg-dude>	UP	UP	0	393607	59688	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
27	2	15	vlan35-MGMT-CIRUAS	vlan35-MGMT-CIRUAS	UP	UP	1000000000	354498248	418414206	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
22	2	49	BR-VL144	BR-VL144	UP	UP	0	149899726	64	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
39	2	15778365	<pppoe-NENDEN>	<pppoe-NENDEN>	UP	UP	0	1375984328	485934941	0	0	2026-11-27 08:13:57	2026-11-27 08:38:06
47	2	58	VLAN902-IDC-3D	VLAN902-IDC-3D	UP	UP	1000000000	2460585372	865133327	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
20	2	15794899	<l2tp-bcs-gp>	<l2tp-bcs-gp>	UP	UP	0	55634	59444	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
36	2	4	ether3	ether3	UP	UP	1000000000	3081608263	3084541397	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
18	2	14	vlan30-MGMT-PNTG	vlan30-MGMT-PNTG	UP	UP	1000000000	62636418	746041188	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
43	2	17	vlan90-MGMT-GK3	vlan90-MGMT-GK3	UP	UP	1000000000	1083490186	4156445231	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
38	2	46	vlan144-out	vlan144-out	UP	UP	1000000000	156085616	745392307	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
29	2	15794902	<l2tp-rektor>	<l2tp-rektor>	UP	UP	0	74	59064	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
21	2	19	vlan107-BAROS	vlan107-BAROS	UP	UP	1000000000	1594942251	774286944	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
34	2	53	BR-VL8	BR-VL8	UP	UP	0	0	27901392	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
19	2	56	VLAN900-CYBER	VLAN900-CYBER	UP	UP	1000000000	1188383583	306711725	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
25	2	9	vlan105-GK2-GK3	vlan105-GK2-GK3	UP	UP	1000000000	503733336	1421385491	0	0	2026-11-27 08:13:57	2026-11-27 08:38:05
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2026_11_26_155440_create_personal_access_tokens_table	1
5	2026_11_26_160000_create_network_monitoring_tables	1
6	2026_11_27_000001_add_alert_type_to_alerts_table	2
\.


--
-- Data for Name: monitoring_results; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.monitoring_results (id, device_id, status, latency, packet_loss, cpu_usage, memory_usage, uptime, checked_at, created_at) FROM stdin;
1	1	ONLINE	3.69	0	50	55	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
2	1	ONLINE	1.8	0	49	58	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
3	1	ONLINE	2.95	0	33	60	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
4	1	ONLINE	2.87	0	52	44	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
5	1	ONLINE	1.6	0	42	44	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
6	1	ONLINE	2.71	0	24	40	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
7	1	ONLINE	3.43	0	31	47	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
8	1	ONLINE	3.76	0	51	59	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
9	1	ONLINE	5.31	0	24	48	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
10	1	ONLINE	3.65	0	34	58	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
11	1	ONLINE	1.81	0	48	50	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
12	1	ONLINE	2.68	0	20	40	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
13	1	ONLINE	5.24	0	24	48	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
14	1	ONLINE	2.41	0	33	54	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
15	1	ONLINE	1.85	0	45	47	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
16	1	ONLINE	4.63	0	55	62	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
17	1	ONLINE	4.47	0	26	55	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
18	1	ONLINE	5.17	0	44	61	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
19	1	ONLINE	3.88	0	50	53	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
20	1	ONLINE	1.87	0	44	54	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
21	1	ONLINE	4.52	0	28	57	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
22	1	ONLINE	5.11	0	23	45	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
23	1	ONLINE	2.91	0	42	58	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
24	1	ONLINE	5.03	0	44	46	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
25	1	ONLINE	3.09	0	37	50	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
26	2	ONLINE	2.53	0	32	56	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
27	2	ONLINE	3.94	0	51	38	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
28	2	ONLINE	2.11	0	36	40	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
29	2	ONLINE	1.49	0	25	62	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
30	2	ONLINE	4.69	0	51	49	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
31	2	ONLINE	3.02	0	36	54	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
32	2	ONLINE	4.11	0	20	41	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
33	2	ONLINE	3.1	0	45	58	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
34	2	ONLINE	1.76	0	55	41	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
35	2	ONLINE	3.03	0	51	35	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
36	2	ONLINE	4.67	0	38	61	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
37	2	ONLINE	2	0	43	61	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
38	2	ONLINE	3.36	0	40	57	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
39	2	ONLINE	4.59	0	39	53	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
40	2	ONLINE	3.94	0	33	38	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
41	2	ONLINE	3.05	0	45	41	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
42	2	ONLINE	4.32	0	36	44	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
43	2	ONLINE	2.88	0	25	57	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
44	2	ONLINE	3.15	0	23	43	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
45	2	ONLINE	4.44	0	52	64	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
46	2	ONLINE	3.96	0	28	46	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
47	2	ONLINE	3	0	51	35	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
48	2	ONLINE	2.34	0	48	39	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
49	2	ONLINE	4.73	0	32	40	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
50	2	ONLINE	2.85	0	31	60	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
51	3	ONLINE	3.93	0	34	61	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
52	3	ONLINE	2.13	0	47	51	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
53	3	ONLINE	2.81	0	25	43	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
54	3	ONLINE	2.62	0	27	42	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
55	3	ONLINE	4.18	0	31	49	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
56	3	ONLINE	4.35	0	22	47	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
57	3	ONLINE	4.71	0	38	57	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
58	3	ONLINE	4.55	0	39	51	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
59	3	ONLINE	3.22	0	44	53	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
60	3	ONLINE	4.66	0	31	42	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
61	3	ONLINE	2.25	0	51	38	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
62	3	ONLINE	4.25	0	48	39	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
63	3	ONLINE	2	0	29	63	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
64	3	ONLINE	2.71	0	47	50	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
65	3	ONLINE	4.87	0	53	42	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
66	3	ONLINE	4.11	0	54	51	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
67	3	ONLINE	3.97	0	26	54	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
68	3	ONLINE	2.74	0	48	65	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
69	3	ONLINE	4.46	0	51	50	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
70	3	ONLINE	3.04	0	53	38	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
71	3	ONLINE	4.83	0	21	58	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
72	3	ONLINE	4.74	0	52	60	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
73	3	ONLINE	3.21	0	32	62	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
74	3	ONLINE	2.97	0	27	65	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
75	3	ONLINE	2.81	0	44	65	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
76	4	ONLINE	4.89	0	41	51	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
77	4	ONLINE	4.62	0	47	41	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
78	4	ONLINE	2.53	0	27	52	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
79	4	ONLINE	2.39	0	48	36	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
80	4	ONLINE	4.06	0	29	46	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
81	4	ONLINE	2.23	0	39	47	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
82	4	ONLINE	2.9	0	54	36	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
83	4	ONLINE	4.91	0	44	63	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
84	4	ONLINE	4.19	0	37	54	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
85	4	ONLINE	4.76	0	47	64	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
86	4	ONLINE	4.06	0	20	56	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
87	4	ONLINE	3.99	0	43	58	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
88	4	ONLINE	1.8	0	40	44	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
89	4	ONLINE	2.7	0	37	61	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
90	4	ONLINE	2.97	0	22	42	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
91	4	ONLINE	3.69	0	36	47	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
92	4	ONLINE	4	0	42	55	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
93	4	ONLINE	3.22	0	55	58	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
94	4	ONLINE	3.36	0	37	50	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
95	4	ONLINE	4.25	0	54	35	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
96	4	ONLINE	2.61	0	26	53	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
97	4	ONLINE	3.21	0	31	60	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
98	4	ONLINE	4.66	0	46	62	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
99	4	ONLINE	2.25	0	54	63	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
100	4	ONLINE	3.01	0	21	63	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
101	5	ONLINE	4.19	0	45	60	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
102	5	ONLINE	2.53	0	39	62	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
103	5	ONLINE	1.77	0	52	43	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
104	5	ONLINE	3.12	0	47	56	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
105	5	ONLINE	3.45	0	36	55	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
106	5	ONLINE	3.1	0	38	48	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
107	5	ONLINE	3.15	0	20	62	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
108	5	ONLINE	3.89	0	47	35	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
109	5	ONLINE	2.98	0	25	46	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
110	5	ONLINE	2.72	0	45	35	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
111	5	ONLINE	2.38	0	27	58	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
112	5	ONLINE	4.43	0	46	41	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
113	5	ONLINE	3.65	0	43	58	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
114	5	ONLINE	1.56	0	35	39	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
115	5	ONLINE	2.62	0	50	40	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
116	5	ONLINE	5.07	0	26	35	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
117	5	ONLINE	3.43	0	33	54	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
118	5	ONLINE	1.82	0	51	54	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
119	5	ONLINE	4.12	0	50	59	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
120	5	ONLINE	4.76	0	53	44	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
121	5	ONLINE	4.13	0	22	62	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
122	5	ONLINE	4.2	0	37	51	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
123	5	ONLINE	4.44	0	55	52	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
124	5	ONLINE	4.64	0	28	44	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
125	5	ONLINE	3.76	0	45	40	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
126	6	ONLINE	1.71	0	43	65	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
127	6	ONLINE	3.76	0	48	57	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
128	6	ONLINE	4.36	0	47	56	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
129	6	ONLINE	4.66	0	38	46	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
130	6	ONLINE	2.47	0	20	40	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
131	6	ONLINE	1.52	0	36	61	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
132	6	ONLINE	5.09	0	44	43	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
133	6	ONLINE	2.1	0	25	44	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
134	6	ONLINE	4.03	0	35	58	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
135	6	ONLINE	2.58	0	26	53	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
136	6	ONLINE	3.4	0	43	58	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
137	6	ONLINE	3.12	0	31	41	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
138	6	ONLINE	2.29	0	26	40	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
139	6	ONLINE	2.37	0	47	59	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
140	6	ONLINE	2.79	0	47	35	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
141	6	ONLINE	5.2	0	25	42	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
142	6	ONLINE	3.64	0	47	56	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
143	6	ONLINE	4.39	0	51	35	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
144	6	ONLINE	3.13	0	29	44	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
145	6	ONLINE	2.78	0	47	38	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
146	6	ONLINE	3.88	0	53	61	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
147	6	ONLINE	2.94	0	32	62	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
148	6	ONLINE	2.27	0	36	65	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
149	6	ONLINE	3.05	0	54	45	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
150	6	ONLINE	3.41	0	54	49	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
151	7	ONLINE	4.43	0	39	52	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
152	7	ONLINE	3.22	0	23	38	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
153	7	ONLINE	2.89	0	27	45	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
154	7	ONLINE	3.77	0	20	42	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
155	7	ONLINE	3.41	0	45	54	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
156	7	ONLINE	3.95	0	45	50	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
157	7	ONLINE	4.46	0	47	52	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
158	7	ONLINE	1.94	0	49	47	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
159	7	ONLINE	5.08	0	53	42	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
160	7	ONLINE	4.02	0	45	40	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
161	7	ONLINE	2.33	0	32	51	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
162	7	ONLINE	2.13	0	54	58	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
163	7	ONLINE	4.73	0	47	55	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
164	7	ONLINE	4.72	0	34	35	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
165	7	ONLINE	4.39	0	23	59	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
166	7	ONLINE	3.06	0	35	39	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
167	7	ONLINE	4.89	0	42	35	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
168	7	ONLINE	5.07	0	54	54	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
169	7	ONLINE	4.05	0	53	57	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
170	7	ONLINE	5.36	0	45	56	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
171	7	ONLINE	3.85	0	34	58	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
172	7	ONLINE	4.23	0	26	60	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
173	7	ONLINE	4.98	0	45	58	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
174	7	ONLINE	2.74	0	49	63	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
175	7	ONLINE	3.05	0	30	63	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
176	8	ONLINE	2.33	0	20	51	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
177	8	ONLINE	3.29	0	48	35	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
178	8	ONLINE	3.21	0	36	48	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
179	8	ONLINE	3.58	0	26	65	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
180	8	ONLINE	4.46	0	20	62	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
181	8	ONLINE	4.4	0	35	51	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
182	8	ONLINE	4.54	0	30	44	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
183	8	ONLINE	5.19	0	23	43	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
184	8	ONLINE	2.68	0	50	62	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
185	8	ONLINE	3.91	0	31	57	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
186	8	ONLINE	3.44	0	52	43	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
187	8	ONLINE	3.28	0	29	57	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
188	8	ONLINE	3.1	0	54	41	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
189	8	ONLINE	2.06	0	39	52	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
190	8	ONLINE	3.15	0	36	56	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
191	8	ONLINE	3.22	0	40	62	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
192	8	ONLINE	4.87	0	36	43	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
193	8	ONLINE	2.33	0	38	47	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
194	8	ONLINE	3.51	0	54	53	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
195	8	ONLINE	4.22	0	35	49	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
196	8	ONLINE	2.53	0	31	53	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
197	8	ONLINE	4.89	0	27	37	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
198	8	ONLINE	2.33	0	30	49	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
199	8	ONLINE	3.19	0	40	37	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
200	8	ONLINE	3.5	0	23	36	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
201	9	ONLINE	1.95	0	26	36	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
202	9	ONLINE	1.56	0	44	49	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
203	9	ONLINE	3.56	0	29	49	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
204	9	ONLINE	3.5	0	48	64	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
205	9	ONLINE	3	0	54	44	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
206	9	ONLINE	2.96	0	48	40	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
207	9	ONLINE	1.36	0	24	44	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
208	9	ONLINE	4.52	0	53	54	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
209	9	ONLINE	4.97	0	40	53	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
210	9	ONLINE	2.42	0	20	52	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
211	9	ONLINE	1.49	0	53	52	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
212	9	ONLINE	4.26	0	44	48	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
213	9	ONLINE	3.95	0	32	35	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
214	9	ONLINE	2.83	0	49	61	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
215	9	ONLINE	2.82	0	54	58	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
216	9	ONLINE	3.57	0	44	47	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
217	9	ONLINE	4.04	0	25	55	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
218	9	ONLINE	3.03	0	42	54	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
219	9	ONLINE	1.86	0	54	49	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
220	9	ONLINE	4.5	0	40	39	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
221	9	ONLINE	3.73	0	42	48	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
222	9	ONLINE	4.47	0	35	36	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
223	9	ONLINE	2.07	0	38	51	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
224	9	ONLINE	4.64	0	37	45	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
225	9	ONLINE	3.18	0	47	59	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
226	10	ONLINE	5.18	0	48	42	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
227	10	ONLINE	3.83	0	44	65	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
228	10	ONLINE	4.03	0	46	40	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
229	10	ONLINE	3.84	0	45	62	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
230	10	ONLINE	1.6	0	42	51	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
231	10	ONLINE	4.36	0	45	42	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
232	10	ONLINE	5.25	0	41	58	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
233	10	ONLINE	3.85	0	45	41	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
234	10	ONLINE	2.69	0	41	47	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
235	10	ONLINE	2.99	0	25	40	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
236	10	ONLINE	5	0	37	55	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
237	10	ONLINE	4.48	0	30	63	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
238	10	ONLINE	4.23	0	40	43	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
239	10	ONLINE	3.53	0	28	49	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
240	10	ONLINE	1.32	0	36	54	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
241	10	ONLINE	4.33	0	23	52	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
242	10	ONLINE	3.97	0	46	62	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
243	10	ONLINE	2.56	0	35	47	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
244	10	ONLINE	2.98	0	29	60	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
245	10	ONLINE	3	0	41	59	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
246	10	ONLINE	4.8	0	38	38	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
247	10	ONLINE	2.09	0	25	64	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
248	10	ONLINE	3.47	0	38	62	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
249	10	ONLINE	4.56	0	32	37	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
250	10	ONLINE	4.57	0	32	63	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
251	11	ONLINE	4.22	0	39	46	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
252	11	ONLINE	3.53	0	42	55	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
253	11	ONLINE	4.39	0	20	48	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
254	11	ONLINE	4.79	0	39	47	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
255	11	ONLINE	2.27	0	29	55	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
256	11	ONLINE	3.95	0	23	62	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
257	11	ONLINE	1.64	0	41	58	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
258	11	ONLINE	3.66	0	35	54	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
259	11	ONLINE	3.39	0	51	40	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
260	11	ONLINE	2.11	0	38	52	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
261	11	ONLINE	2.28	0	30	57	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
262	11	ONLINE	4.56	0	53	61	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
263	11	ONLINE	2.22	0	22	35	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
264	11	ONLINE	3.63	0	52	42	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
265	11	ONLINE	1.54	0	41	55	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
266	11	ONLINE	3.31	0	52	49	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
267	11	ONLINE	4.38	0	45	60	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
268	11	ONLINE	2.22	0	44	63	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
269	11	ONLINE	3.03	0	42	55	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
270	11	ONLINE	4	0	55	60	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
271	11	ONLINE	3.95	0	43	59	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
272	11	ONLINE	3.25	0	55	60	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
273	11	ONLINE	4.44	0	50	54	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
274	11	ONLINE	4.14	0	31	63	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
275	11	ONLINE	3.78	0	20	46	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
276	12	ONLINE	2.48	0	21	46	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
277	12	ONLINE	3.17	0	24	35	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
278	12	ONLINE	2.1	0	42	38	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
279	12	ONLINE	3.31	0	54	45	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
280	12	ONLINE	5.27	0	21	48	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
281	12	ONLINE	1.57	0	55	62	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
282	12	ONLINE	2.16	0	49	65	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
283	12	ONLINE	4.95	0	42	44	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
284	12	ONLINE	2.03	0	27	39	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
285	12	ONLINE	3.58	0	36	43	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
286	12	ONLINE	4.04	0	54	38	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
287	12	ONLINE	2.24	0	21	44	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
288	12	ONLINE	1.21	0	35	50	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
289	12	ONLINE	4.83	0	34	48	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
290	12	ONLINE	3.9	0	40	35	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
291	12	ONLINE	2.32	0	54	36	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
292	12	ONLINE	4.28	0	48	41	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
293	12	ONLINE	2.36	0	29	53	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
294	12	ONLINE	4.31	0	21	63	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
295	12	ONLINE	3.89	0	44	61	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
296	12	ONLINE	3.74	0	25	46	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
297	12	ONLINE	2.53	0	50	50	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
298	12	ONLINE	2.78	0	31	37	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
299	12	ONLINE	2.21	0	32	47	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
300	12	ONLINE	3.55	0	54	52	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
301	13	ONLINE	3.68	0	36	59	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
302	13	ONLINE	3.47	0	51	40	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
303	13	ONLINE	2.6	0	55	38	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
304	13	ONLINE	3.39	0	31	42	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
305	13	ONLINE	2.43	0	33	53	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
306	13	ONLINE	2.81	0	32	57	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
307	13	ONLINE	1.97	0	32	58	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
308	13	ONLINE	2.26	0	48	38	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
309	13	ONLINE	5.09	0	51	45	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
310	13	ONLINE	3.67	0	23	59	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
311	13	ONLINE	4.3	0	27	43	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
312	13	ONLINE	3.06	0	22	58	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
313	13	ONLINE	3.49	0	25	53	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
314	13	ONLINE	4.15	0	39	52	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
315	13	ONLINE	4.26	0	28	62	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
316	13	ONLINE	3.57	0	38	65	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
317	13	ONLINE	3.43	0	53	58	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
318	13	ONLINE	4.68	0	23	65	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
319	13	ONLINE	1.55	0	34	48	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
320	13	ONLINE	3.31	0	52	55	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
321	13	ONLINE	3.22	0	43	36	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
322	13	ONLINE	2.07	0	39	62	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
323	13	ONLINE	3.6	0	30	52	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
324	13	ONLINE	3.54	0	49	53	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
325	13	ONLINE	2.87	0	30	65	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
326	14	ONLINE	2.92	0	48	61	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
327	14	ONLINE	4.89	0	41	40	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
328	14	ONLINE	2.26	0	30	44	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
329	14	ONLINE	4.12	0	54	62	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
330	14	ONLINE	3.4	0	29	45	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
331	14	ONLINE	2.36	0	28	51	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
332	14	ONLINE	3.11	0	23	37	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
333	14	ONLINE	3.43	0	20	51	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
334	14	ONLINE	4.1	0	34	49	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
335	14	ONLINE	4.76	0	43	43	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
336	14	ONLINE	4.64	0	55	53	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
337	14	ONLINE	2.09	0	27	52	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
338	14	ONLINE	2.92	0	22	37	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
339	14	ONLINE	2.81	0	37	63	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
340	14	ONLINE	3.52	0	45	61	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
341	14	ONLINE	2.92	0	30	49	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
342	14	ONLINE	4.51	0	50	59	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
343	14	ONLINE	1.71	0	24	37	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
344	14	ONLINE	3.2	0	52	61	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
345	14	ONLINE	4.56	0	44	63	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
346	14	ONLINE	4.82	0	33	36	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
347	14	ONLINE	3.23	0	50	44	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
348	14	ONLINE	3.16	0	54	60	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
349	14	ONLINE	5.19	0	26	61	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
350	14	ONLINE	4.95	0	27	43	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
351	15	ONLINE	4.04	0	37	59	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
352	15	ONLINE	3.83	0	41	64	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
353	15	ONLINE	4.55	0	35	53	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
354	15	ONLINE	4.19	0	46	63	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
355	15	ONLINE	2.36	0	41	54	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
356	15	ONLINE	4.67	0	50	55	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
357	15	ONLINE	3.57	0	28	59	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
358	15	ONLINE	4.26	0	27	47	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
359	15	ONLINE	3.72	0	38	49	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
360	15	ONLINE	4.67	0	35	49	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
361	15	ONLINE	4.95	0	34	57	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
362	15	ONLINE	2.39	0	22	43	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
363	15	ONLINE	4.4	0	46	40	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
364	15	ONLINE	4.48	0	21	35	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
365	15	ONLINE	3.88	0	21	61	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
366	15	ONLINE	3.03	0	25	49	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
367	15	ONLINE	2.28	0	26	41	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
368	15	ONLINE	4.59	0	27	57	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
369	15	ONLINE	2.74	0	27	65	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
370	15	ONLINE	4.08	0	44	62	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
371	15	ONLINE	2.98	0	45	62	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
372	15	ONLINE	2.39	0	41	61	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
373	15	ONLINE	2.02	0	28	64	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
374	15	ONLINE	2.54	0	51	58	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
375	15	ONLINE	3.44	0	51	62	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
376	16	ONLINE	2.74	0	25	57	186400	2026-11-26 07:36:36	2026-11-26 07:36:36
377	16	ONLINE	2.66	0	45	55	182800	2026-11-26 08:36:36	2026-11-26 08:36:36
378	16	ONLINE	3.44	0	48	52	179200	2026-11-26 09:36:36	2026-11-26 09:36:36
379	16	ONLINE	3.69	0	30	44	175600	2026-11-26 10:36:36	2026-11-26 10:36:36
380	16	ONLINE	4.2	0	24	57	172000	2026-11-26 11:36:36	2026-11-26 11:36:36
381	16	ONLINE	4.33	0	43	65	168400	2026-11-26 12:36:36	2026-11-26 12:36:36
382	16	ONLINE	2.59	0	43	59	164800	2026-11-26 13:36:36	2026-11-26 13:36:36
383	16	ONLINE	4.79	0	39	53	161200	2026-11-26 14:36:36	2026-11-26 14:36:36
384	16	ONLINE	3.03	0	55	54	157600	2026-11-26 15:36:36	2026-11-26 15:36:36
385	16	ONLINE	2.1	0	39	46	154000	2026-11-26 16:36:36	2026-11-26 16:36:36
386	16	ONLINE	3.84	0	53	43	150400	2026-11-26 17:36:36	2026-11-26 17:36:36
387	16	ONLINE	5.08	0	46	46	146800	2026-11-26 18:36:36	2026-11-26 18:36:36
388	16	ONLINE	2.52	0	55	36	143200	2026-11-26 19:36:36	2026-11-26 19:36:36
389	16	ONLINE	3.88	0	39	57	139600	2026-11-26 20:36:36	2026-11-26 20:36:36
390	16	ONLINE	3.72	0	51	40	136000	2026-11-26 21:36:36	2026-11-26 21:36:36
391	16	ONLINE	1.63	0	26	51	132400	2026-11-26 22:36:36	2026-11-26 22:36:36
392	16	ONLINE	3.31	0	55	55	128800	2026-11-26 23:36:36	2026-11-26 23:36:36
393	16	ONLINE	4.92	0	21	57	125200	2026-11-27 00:36:36	2026-11-27 00:36:36
394	16	ONLINE	4.62	0	32	35	121600	2026-11-27 01:36:36	2026-11-27 01:36:36
395	16	ONLINE	1.6	0	45	51	118000	2026-11-27 02:36:36	2026-11-27 02:36:36
396	16	ONLINE	3.31	0	20	52	114400	2026-11-27 03:36:36	2026-11-27 03:36:36
397	16	ONLINE	3.26	0	37	59	110800	2026-11-27 04:36:36	2026-11-27 04:36:36
398	16	ONLINE	3.35	0	21	52	107200	2026-11-27 05:36:36	2026-11-27 05:36:36
399	16	ONLINE	3.71	0	49	58	103600	2026-11-27 06:36:36	2026-11-27 06:36:36
400	16	ONLINE	3.63	0	33	60	100000	2026-11-27 07:36:36	2026-11-27 07:36:36
401	4	DOWN	\N	100	\N	\N	\N	2026-11-27 07:44:58	2026-11-27 07:47:50
402	4	DOWN	\N	100	\N	\N	\N	2026-11-27 07:45:28	2026-11-27 07:48:19
403	14	DOWN	\N	100	\N	\N	\N	2026-11-27 07:48:19	2026-11-27 07:51:10
404	4	DOWN	\N	100	\N	\N	\N	2026-11-27 07:51:10	2026-11-27 07:54:02
405	4	DOWN	\N	100	\N	\N	\N	2026-11-27 07:54:01	2026-11-27 07:56:54
406	10	DOWN	\N	100	\N	\N	\N	2026-11-27 07:56:53	2026-11-27 07:59:20
407	6	DOWN	\N	100	\N	\N	\N	2026-11-27 07:59:19	2026-11-27 08:00:41
408	2	UP	5.011	0	12.333333333333	41.9	1841523	2026-11-27 08:00:41	2026-11-27 08:01:22
409	2	UP	4.976	0	7.6666666666667	42	1841563	2026-11-27 08:01:21	2026-11-27 08:02:02
410	2	UP	5.018	0	4.5555555555556	42	1841603	2026-11-27 08:02:01	2026-11-27 08:02:42
411	16	DOWN	\N	100	\N	\N	\N	2026-11-27 08:02:42	2026-11-27 08:03:29
412	16	DOWN	\N	100	\N	\N	\N	2026-11-27 08:03:29	2026-11-27 08:04:53
413	9	DOWN	\N	100	\N	\N	\N	2026-11-27 08:04:53	2026-11-27 08:07:34
414	10	DOWN	\N	100	\N	\N	\N	2026-11-27 08:11:02	2026-11-27 08:13:58
415	4	DOWN	\N	100	\N	\N	\N	2026-11-27 08:13:57	2026-11-27 08:16:54
416	6	DOWN	\N	100	\N	\N	\N	2026-11-27 08:16:53	2026-11-27 08:19:52
417	10	DOWN	\N	100	\N	\N	\N	2026-11-27 08:19:52	2026-11-27 08:22:48
418	14	DOWN	\N	100	\N	\N	\N	2026-11-27 08:22:48	2026-11-27 08:24:30
419	2	UP	5.011	0	12	41.9	1842952	2026-11-27 08:24:30	2026-11-27 08:25:11
420	15	DOWN	\N	100	\N	\N	\N	2026-11-27 08:24:30	2026-11-27 08:25:11
421	2	UP	4.973	0	10.444444444444	41.9	1842992	2026-11-27 08:25:10	2026-11-27 08:25:51
422	10	DOWN	\N	100	\N	\N	\N	2026-11-27 08:25:10	2026-11-27 08:25:51
423	2	UP	4.987	0	6.4444444444444	41.9	1843032	2026-11-27 08:25:51	2026-11-27 08:26:31
424	10	DOWN	\N	100	\N	\N	\N	2026-11-27 08:25:51	2026-11-27 08:26:31
425	2	UP	5.022	0	2.3333333333333	39.9	1843073	2026-11-27 08:26:31	2026-11-27 08:27:12
426	9	DOWN	\N	100	\N	\N	\N	2026-11-27 08:26:31	2026-11-27 08:27:12
427	2	UP	5.017	0	1.3333333333333	41.9	1843113	2026-11-27 08:27:11	2026-11-27 08:27:52
428	14	DOWN	\N	100	\N	\N	\N	2026-11-27 08:27:11	2026-11-27 08:27:52
429	15	DOWN	\N	100	\N	\N	\N	2026-11-27 08:27:51	2026-11-27 08:29:26
430	6	DOWN	\N	100	\N	\N	\N	2026-11-27 08:29:26	2026-11-27 08:32:12
431	6	DOWN	\N	100	\N	\N	\N	2026-11-27 08:32:12	2026-11-27 08:35:09
432	15	DOWN	\N	100	\N	\N	\N	2026-11-27 08:35:08	2026-11-27 08:38:06
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
DrC8kNdASeJ22R6j6gAmRfaZY3nbkzZ7vOEAmdgG	\N	127.0.0.1	curl/8.5.0	eyJfdG9rZW4iOiJjRXRrUlJVMU1NbExVWm96OFY4MVJIRlhKTkI3ZHFUWGpxWFd0MDlYIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==	1795765445
4mbT2x3cPUMvbQm2yX0HU5kJHSxV6GZlhiVolUx7	1	103.140.131.161	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.148.0 Chrome/150.0.7871.250 Electron/43.8.10 Safari/537.36	eyJfdG9rZW4iOiJ1UGhqZFJxOEdJZDlnUldsQ0VxSVJKVWZKQXFhbjZPVlBHMklrV0FuIiwidXJsIjpbXSwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEwMy4xNDIuMTk0LjgwOjgwMDBcL3RvcG9sb2d5Iiwicm91dGUiOiJ0b3BvbG9neS5pbmRleCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoxLCJwYXNzd29yZF9oYXNoX3dlYiI6IjJmNjM0NjU1MmYyODM0NzA1OGU0NmYzYjIxYmIzMzlmMGRmYTMxMmZmNGY1NGE4MTIzMWNkNWEyMmI0NjNhYTYifQ==	1795765655
7OvL5glDVzeQWfTiaYNGRgqXPBNUvDfOInxFkini	1	103.140.131.161	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36 Edg/158.0.0.0	eyJfdG9rZW4iOiJJblVES3Y4cU5ZZzFRTEhBclRBS05IMzdOc0tQWG1ZSG1mcGNJcHlPIiwidXJsIjpbXSwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEwMy4xNDIuMTk0LjgwOjgwMDBcL2Rhc2hib2FyZCIsInJvdXRlIjoiZGFzaGJvYXJkIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjEsInBhc3N3b3JkX2hhc2hfd2ViIjoiMmY2MzQ2NTUyZjI4MzQ3MDU4ZTQ2ZjNiMjFiYjMzOWYwZGZhMzEyZmY0ZjU0YTgxMjMxY2Q1YTIyYjQ2M2FhNiJ9	1795767860
BnPoUlxKNYGeTD5GQDoHqBvgfMWf9aHE0yQ0i62e	1	103.140.131.161	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.148.0 Chrome/150.0.7871.250 Electron/43.8.10 Safari/537.36	eyJfdG9rZW4iOiJudkd5NjhZdExWYkdNTnJ2RHNuWXpaYVdTZ2JzTUNZMlo5ZTQ4dE12IiwidXJsIjpbXSwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEwMy4xNDIuMTk0LjgwOjgwMDBcL2Rhc2hib2FyZCIsInJvdXRlIjoiZGFzaGJvYXJkIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjEsInBhc3N3b3JkX2hhc2hfd2ViIjoiMmY2MzQ2NTUyZjI4MzQ3MDU4ZTQ2ZjNiMjFiYjMzOWYwZGZhMzEyZmY0ZjU0YTgxMjMxY2Q1YTIyYjQ2M2FhNiJ9	1795768828
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.settings (id, key, value, type, description, created_at, updated_at) FROM stdin;
1	latency_warning_ms	50	float	Ambang batas latency status WARNING (milidetik)	2026-11-27 03:55:53	2026-11-27 03:55:53
2	latency_critical_ms	150	float	Ambang batas latency status CRITICAL (milidetik)	2026-11-27 03:55:53	2026-11-27 03:55:53
3	packet_loss_warning_pct	5	float	Ambang batas packet loss status WARNING (%)	2026-11-27 03:55:53	2026-11-27 03:55:53
4	packet_loss_critical_pct	20	float	Ambang batas packet loss status CRITICAL (%)	2026-11-27 03:55:53	2026-11-27 03:55:53
5	cpu_warning_pct	75	float	Ambang batas penggunaan CPU status WARNING (%)	2026-11-27 03:55:53	2026-11-27 03:55:53
6	cpu_critical_pct	90	float	Ambang batas penggunaan CPU status CRITICAL (%)	2026-11-27 03:55:53	2026-11-27 03:55:53
7	memory_warning_pct	80	float	Ambang batas penggunaan Memory status WARNING (%)	2026-11-27 03:55:53	2026-11-27 03:55:53
8	memory_critical_pct	95	float	Ambang batas penggunaan Memory status CRITICAL (%)	2026-11-27 03:55:53	2026-11-27 03:55:53
9	monitoring_api_token	ubj_nms_engine_secret_token_2026	string	Kunci otorisasi monitoring engine Golang	2026-11-27 03:55:53	2026-11-27 03:55:53
10	default_polling_interval	30	integer	Interval standar monitoring perangkat (detik)	2026-11-27 03:55:53	2026-11-27 03:55:53
\.


--
-- Data for Name: topology_edges; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.topology_edges (id, source_device_id, target_device_id, source_interface_id, target_interface_id, label, status, bandwidth, created_at, updated_at) FROM stdin;
1	1	2	\N	\N	WAN Uplink (1 Gbps)	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
2	2	4	\N	\N	Core Backbone (10 Gbps)	UP	10 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
3	2	3	\N	\N	Interkoneksi Kampus 1 & 2 (1 Gbps)	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
4	3	5	\N	\N	Trunk Ciwaru (1 Gbps)	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
5	5	13	\N	\N	Access Point Ciwaru PoE	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
6	4	14	\N	\N	SIAKAD Dedicated (10 Gbps)	UP	10 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
7	4	15	\N	\N	LMS Elearning (10 Gbps)	UP	10 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
8	4	16	\N	\N	Web Portal UBJ (1 Gbps)	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
9	4	6	\N	\N	Trunk Gedung A (1 Gbps)	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
10	4	7	\N	\N	Trunk Gedung B FTI (1 Gbps)	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
11	4	8	\N	\N	Trunk Gedung C (1 Gbps)	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
12	6	9	\N	\N	AP Lobby Rektorat PoE	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
13	6	10	\N	\N	AP Perpustakaan PoE	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
14	7	11	\N	\N	AP Lab Komputer FTI PoE	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
15	8	12	\N	\N	AP Auditorium PoE	UP	1 Gbps	2026-11-27 07:36:36	2026-11-27 07:36:36
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ubj_user
--

COPY public.users (id, name, email, email_verified_at, password, role, remember_token, created_at, updated_at) FROM stdin;
1	Administrator Jaringan UBJ	admin@ubj.ac.id	\N	$2y$12$bBc11mVYsD7DHXJaTGIikeiAVSU1YwdbMyi22Fq9NtbWg0y.K/PYq	admin	\N	2026-11-27 03:55:53	2026-11-27 03:55:53
2	Operator NOC UBJ	operator@ubj.ac.id	\N	$2y$12$ydoOTsC.wp9cncnkwg2FCOO4lUxMnJZlQBZh69FAMfrPz/n9NtQya	operator	\N	2026-11-27 03:55:53	2026-11-27 03:55:53
\.


--
-- Name: alert_histories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.alert_histories_id_seq', 1, false);


--
-- Name: alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.alerts_id_seq', 15, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 7, true);


--
-- Name: devices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.devices_id_seq', 16, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: interface_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.interface_metrics_id_seq', 476, true);


--
-- Name: interfaces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.interfaces_id_seq', 47, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.migrations_id_seq', 6, true);


--
-- Name: monitoring_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.monitoring_results_id_seq', 432, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 1, false);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.settings_id_seq', 10, true);


--
-- Name: topology_edges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.topology_edges_id_seq', 15, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ubj_user
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: alert_histories alert_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.alert_histories
    ADD CONSTRAINT alert_histories_pkey PRIMARY KEY (id);


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: interface_metrics interface_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.interface_metrics
    ADD CONSTRAINT interface_metrics_pkey PRIMARY KEY (id);


--
-- Name: interfaces interfaces_device_id_if_index_unique; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.interfaces
    ADD CONSTRAINT interfaces_device_id_if_index_unique UNIQUE (device_id, if_index);


--
-- Name: interfaces interfaces_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.interfaces
    ADD CONSTRAINT interfaces_pkey PRIMARY KEY (id);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: monitoring_results monitoring_results_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.monitoring_results
    ADD CONSTRAINT monitoring_results_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: settings settings_key_unique; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_unique UNIQUE (key);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: topology_edges topology_edges_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.topology_edges
    ADD CONSTRAINT topology_edges_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: alerts_alert_type_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX alerts_alert_type_index ON public.alerts USING btree (alert_type);


--
-- Name: alerts_device_id_status_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX alerts_device_id_status_index ON public.alerts USING btree (device_id, status);


--
-- Name: alerts_severity_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX alerts_severity_index ON public.alerts USING btree (severity);


--
-- Name: alerts_status_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX alerts_status_index ON public.alerts USING btree (status);


--
-- Name: alerts_triggered_at_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX alerts_triggered_at_index ON public.alerts USING btree (triggered_at);


--
-- Name: alerts_type_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX alerts_type_index ON public.alerts USING btree (type);


--
-- Name: audit_logs_action_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX audit_logs_action_index ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_module_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX audit_logs_module_index ON public.audit_logs USING btree (module);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: devices_ip_address_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX devices_ip_address_index ON public.devices USING btree (ip_address);


--
-- Name: devices_monitoring_enabled_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX devices_monitoring_enabled_index ON public.devices USING btree (monitoring_enabled);


--
-- Name: devices_status_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX devices_status_index ON public.devices USING btree (status);


--
-- Name: failed_jobs_connection_queue_failed_at_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX failed_jobs_connection_queue_failed_at_index ON public.failed_jobs USING btree (connection, queue, failed_at);


--
-- Name: interface_metrics_interface_id_recorded_at_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX interface_metrics_interface_id_recorded_at_index ON public.interface_metrics USING btree (interface_id, recorded_at);


--
-- Name: interface_metrics_recorded_at_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX interface_metrics_recorded_at_index ON public.interface_metrics USING btree (recorded_at);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: monitoring_results_checked_at_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX monitoring_results_checked_at_index ON public.monitoring_results USING btree (checked_at);


--
-- Name: monitoring_results_device_id_checked_at_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX monitoring_results_device_id_checked_at_index ON public.monitoring_results USING btree (device_id, checked_at);


--
-- Name: monitoring_results_status_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX monitoring_results_status_index ON public.monitoring_results USING btree (status);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: users_role_index; Type: INDEX; Schema: public; Owner: ubj_user
--

CREATE INDEX users_role_index ON public.users USING btree (role);


--
-- Name: alert_histories alert_histories_alert_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.alert_histories
    ADD CONSTRAINT alert_histories_alert_id_foreign FOREIGN KEY (alert_id) REFERENCES public.alerts(id) ON DELETE CASCADE;


--
-- Name: alert_histories alert_histories_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.alert_histories
    ADD CONSTRAINT alert_histories_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: alerts alerts_device_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_device_id_foreign FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: interface_metrics interface_metrics_interface_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.interface_metrics
    ADD CONSTRAINT interface_metrics_interface_id_foreign FOREIGN KEY (interface_id) REFERENCES public.interfaces(id) ON DELETE CASCADE;


--
-- Name: interfaces interfaces_device_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.interfaces
    ADD CONSTRAINT interfaces_device_id_foreign FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE CASCADE;


--
-- Name: monitoring_results monitoring_results_device_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.monitoring_results
    ADD CONSTRAINT monitoring_results_device_id_foreign FOREIGN KEY (device_id) REFERENCES public.devices(id) ON DELETE CASCADE;


--
-- Name: topology_edges topology_edges_source_device_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.topology_edges
    ADD CONSTRAINT topology_edges_source_device_id_foreign FOREIGN KEY (source_device_id) REFERENCES public.devices(id) ON DELETE CASCADE;


--
-- Name: topology_edges topology_edges_source_interface_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.topology_edges
    ADD CONSTRAINT topology_edges_source_interface_id_foreign FOREIGN KEY (source_interface_id) REFERENCES public.interfaces(id) ON DELETE SET NULL;


--
-- Name: topology_edges topology_edges_target_device_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.topology_edges
    ADD CONSTRAINT topology_edges_target_device_id_foreign FOREIGN KEY (target_device_id) REFERENCES public.devices(id) ON DELETE CASCADE;


--
-- Name: topology_edges topology_edges_target_interface_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: ubj_user
--

ALTER TABLE ONLY public.topology_edges
    ADD CONSTRAINT topology_edges_target_interface_id_foreign FOREIGN KEY (target_interface_id) REFERENCES public.interfaces(id) ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO ubj_user;


--
-- PostgreSQL database dump complete
--

\unrestrict no3dKlwgQB5jCxQpUiSBKajA89EWMTXNpuB9dMZlcfiHTBgnxwP2ikwivjwWW6x

