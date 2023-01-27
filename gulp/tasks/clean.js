// ____________________________________Очищает папку_______________________________
import { deleteAsync } from 'del'
export const clean = () => {
	return deleteAsync(gl.path.clean)
}
