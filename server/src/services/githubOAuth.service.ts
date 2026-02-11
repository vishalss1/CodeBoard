import axios from "axios";

const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL!;

export const exchangeCodeForToken = async (code: string) => {
    const response = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code,
            redirect_url: GITHUB_CALLBACK_URL,
        },
        {
            headers: {
                Accept: "application/json",
            },
        }
    );

    return response.data.access_token;
};

export const fetchGithubUser = async (accessToken : string) => {
    const response = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return {
        github_id: response.data.id.toString(),
        email: response.data.email,
        username: response.data.login,
    };
};