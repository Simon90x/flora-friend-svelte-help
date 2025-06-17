// Importazioni, costanti e inizializzazione (modalità demo se mancano SUPABASE_URL/KEY)
import { createClient } from '@supabase/supabase-js';
import i18n from '../i18n';
import {
	DEFAULT_PLANT_IMAGE,
	EXAMPLE_PLANT_IMAGE_1,
	EXAMPLE_PLANT_IMAGE_2,
	EXAMPLE_SEEDLING_POT,
	EXAMPLE_PLANT_GROWING_TALLER,
	EXAMPLE_PLANT_WITH_STAKE,
	EXAMPLE_PLANT_FLOWERS,
	EXAMPLE_PLANT_GREEN_FRUIT,
	EXAMPLE_PLANT_RIPENING_FRUIT,
	EXAMPLE_MATURE_FLOWERING_PLANT
} from '../constants';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
	try {
		supabase = createClient(supabaseUrl, supabaseAnonKey);
	} catch (error) {
		console.error("Error initializing Supabase client:", error);
	}
} else {
	console.warn("Supabase URL or Anon Key not provided. Demo mode active.");
}

// Funzione per simulare un ritardo nelle chiamate API
const mockApiDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Dependency injection per identificare la sessione demo
let authDependency = null;
export const configureAuthDependency = (dependency) => {
	authDependency = dependency;
};

// Funzione ausiliaria per ottenere l'utente Supabase corrente (se disponibile)
const getCurrentSupabaseUser = async () => {
	if (!supabase) return null;
	const { data: { user } } = await supabase.auth.getUser();
	return user;
};

// --- AUTENTICAZIONE ---

export async function fetchCurrentUser(token) {
	console.log('API CALL: GET /api/auth/me');
	await mockApiDelay(100);
	if (!supabase) {
		console.warn("Supabase not initialized, demo mode active.");
		return authDependency && authDependency.getIsDemoSession() ? authDependency.getCurrentUser() : null;
	}
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return null;
	return {
		id: user.id,
		email: user.email || '',
		name: user.email ? user.email.split('@')[0] : 'New User',
		token: (await supabase.auth.getSession())?.data.session?.access_token || '',
		avatarUrl: user.user_metadata?.avatar_url,
		registrationDate: user.created_at
	};
}

export async function loginUser(email, passwordInput) {
	console.log('API CALL: POST /api/auth/login', { email });
	await mockApiDelay(400);
	if (authDependency && authDependency.getIsDemoSession()) {
		return { id: 'demo', email: 'demo@example.com', name: 'Demo User', token: 'demo-token' };
	}
	if (!supabase) throw new Error("Supabase not initialized.");
	const { data, error } = await supabase.auth.signInWithPassword({ email, password: passwordInput });
	if (error) throw new Error(error.message || i18n.t('auth.errors.invalidCredentials'));
	if (!data.user) throw new Error(i18n.t('auth.errors.loginFailed'));
	return await fetchCurrentUser();
}

export async function signupUser(name, email, passwordInput) {
	console.log('API CALL: POST /api/auth/signup', { name, email });
	await mockApiDelay(500);
	if (authDependency && authDependency.getIsDemoSession()) {
		return { id: 'demo', email, name, token: 'demo-token' };
	}
	if (!supabase) throw new Error("Supabase non inizializzato.");
	const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
		email,
		password: passwordInput,
		options: { data: { name } }
	});
	if (signUpError) throw new Error(signUpError.message || i18n.t('auth.errors.signupFailed'));
	if (!signUpData.user) throw new Error(i18n.t('auth.errors.signupFailed'));
	return await fetchCurrentUser();
}

export async function logoutUser() {
	console.log('API CALL: POST /api/auth/logout');
	await mockApiDelay(100);
	if (authDependency && authDependency.getIsDemoSession()) return Promise.resolve();
	if (!supabase) {
		console.warn("Supabase non inizializzato.");
		return Promise.resolve();
	}
	const { error } = await supabase.auth.signOut();
	if (error) console.error("Error during logout:", error);
	return Promise.resolve();
}

// --- MANAGEMENT OF PLANTS ---

const getDemoPlants = () => [
	{
		id: 'plant_demo_1',
		name: i18n.t('demo.plant1.name', "Demo Monstera"),
		species: 'Monstera deliciosa',
		dateAdded: '2023-05-10T10:00:00Z',
		coverImage: EXAMPLE_PLANT_IMAGE_1,
		notes: i18n.t('demo.plant1.notes', "A lovely demo plant.")
	},
	{
		id: 'plant_demo_2',
		name: i18n.t('demo.plant2.name', "Demo Snake Plant"),
		species: 'Sansevieria trifasciata',
		dateAdded: '2023-06-15T11:30:00Z',
		coverImage: EXAMPLE_PLANT_IMAGE_2,
		notes: i18n.t('demo.plant2.notes', "Very resilient demo plant.")
	}
];

export async function fetchPlants() {
	console.log('API CALL: GET /api/plants');
	await mockApiDelay(500);
	if (authDependency && authDependency.getIsDemoSession()) return getDemoPlants();
	if (!supabase) throw new Error("Supabase not initialized for plant operations.");
	const currentUser = authDependency && authDependency.getCurrentUser();
	if (!currentUser) throw new Error("User not authenticated.");
	const { data, error } = await supabase
		.from('plants')
		.select('*')
		.eq('user_id', currentUser.id)
		.order('created_at', { ascending: false });
	if (error) throw error;
	return data || [];
}

export async function createPlant(plantData) {
	console.log('API CALL: POST /api/plants', plantData);
	await mockApiDelay(300);
	if (authDependency && authDependency.getIsDemoSession()) {
		// Use backticks for the template literal correctly
		return { 
			...plantData, 
			id: `plant_demo_${Date.now()}`, 
			coverImage: plantData.coverImage || DEFAULT_PLANT_IMAGE 
		};
	}
	if (!supabase) throw new Error("Supabase not initialized.");
	const currentUser = authDependency && authDependency.getCurrentUser();
	if (!currentUser) throw new Error("User not authenticated.");
	const { data, error } = await supabase
		.from('plants')
		.insert([{ ...plantData, user_id: currentUser.id, cover_image: plantData.coverImage || DEFAULT_PLANT_IMAGE }])
		.select()
		.single();
	if (error) throw error;
	return data;
}

export async function deletePlantApi(plantId) {
	console.log(`API CALL: DELETE /api/plants/${plantId}`);
	await mockApiDelay(300);
	if (authDependency && authDependency.getIsDemoSession()) return Promise.resolve();
	if (!supabase) throw new Error("Supabase not initialized.");
	const currentUser = authDependency && authDependency.getCurrentUser();
	if (!currentUser) throw new Error("User not authenticated.");
	const { error } = await supabase
		.from('plants')
		.delete()
		.match({ id: plantId, user_id: currentUser.id });
	if (error) throw error;
	return Promise.resolve();
}

// --- ESEMPIO: GROWTH LOGS ---
// Le altre funzioni (createGrowthLog, updateGrowthLog, deleteGrowthLog, fetchPlantHealthLogs, createPlantHealthLog, deletePlantHealthLog, fetchAdviceList, createAdvice, deleteAdvice)
// devono seguire la medesima logica, con simulazione in demo mode tramite mockApiDelay e controllo su authDependency.getIsDemoSession()
//```