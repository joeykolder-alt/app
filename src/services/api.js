export const authWithSuperQi = async (token) => {
    try {
        const response = await fetch('http://server.mouamle.space:19990/api/auth-with-superQi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to authenticate:', error);
        throw error;
    }
};
